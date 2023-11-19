import psycopg2
import pandas as pd
from utils.config import ConfigUtil
from utils import utils
import hashlib


class UserRepository:
    def __init__(self):
        config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=config.get('name'),
            user=config.get('user'),
            password=config.get('password'),
            host=config.get('host'),
            port=config.get('port'))

    def login(self, user_name, password):
        '''
        return None if authentication fails
        '''
        sql = f'''SELECT * FROM users
                           WHERE username = '{user_name}';'''
        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            if row is None:
                return None

            pwd_salt = row[f2i["password_salt"]]
            pwd_hash = row[f2i["password_hash"]]
            if pwd_hash != hashlib.sha256((password+pwd_salt).encode()).hexdigest():
                return None
            else:
                token = utils.rand_str()
                # current expire time is 30 min
                expire = utils.get_time() + 1800

                token_sql = f'''DELETE FROM session
                                WHERE user_id = {row[f2i["id"]]};
                                INSERT INTO session(token, expire, user_id)
                                VALUES(%s, %s, %s);'''
                cur.execute(token_sql,(token,expire,row[f2i["id"]]))
                self.conn.commit()
                return LoginEntity(token,row[f2i["id"]])

        

    def get_user(self, user_id):
        '''
        return None if user doesn't exist
        '''
        sql = f'''SELECT * FROM users
                           WHERE id = {user_id};'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            if row is None:
                return None

            return UserEntity(
                row[f2i['id']],
                row[f2i['username']],
                row[f2i['password_salt']],
                row[f2i['password_hash']],
                row[f2i['driver_data_id']],
                row[f2i['total_order_count']],
                row[f2i['abandon_order_count']])

    def get_user_id(self, token):
        '''
        return None if token is invalid
        '''
        get_id_sql = f'''SELECT expire, user_id FROM session
                         WHERE token = '{token}';'''
        delete_token_sql = f'''DELETE FROM session
                               WHERE token = '{token}';'''

        with self.conn.cursor() as cur:
            cur.execute(get_id_sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            if row is None:
                # token doesn't exist
                return None

            if row[f2i['expire']] < utils.get_time():
                # token has expired, delete it
                cur.execute(delete_token_sql)
                self.conn.commit()
                return None

            return row[f2i['user_id']]

    def get_driver_data(self, driver_data_id):
        '''
        driver_data exists
        '''
        sql = f'''SELECT * FROM driver_datas
                  WHERE id = {driver_data_id};'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            return DriverDataEntity(
                row[f2i['id']],
                row[f2i['vehicle_name']],
                row[f2i['vehicle_plate']],
                row[f2i['passenger_count']])
class LoginEntity:
    def __init__(self, token, user_id):
        self.token = token
        self.user_id = user_id

class UserEntity:
    def __init__(self, user_id, user_name, password_salt, password_hash, driver_data_id, total_order_count, abandon_order_count):
        self.user_id = user_id
        self.user_name = user_name
        self.password_salt = password_salt
        self.password_hash = password_hash
        self.driver_data_id = driver_data_id
        self.total_order_count = total_order_count
        self.abandon_order_count = abandon_order_count


class DriverDataEntity:
    def __init__(self, data_id, vehicle_name, vehicle_plate, passenger_count):
        self.data_id = data_id
        self.vehicle_name = vehicle_name
        self.vehicle_plate = vehicle_plate
        self.passenger_count = passenger_count
