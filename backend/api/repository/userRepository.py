import psycopg2
from utils.config import Config
from utils.dbConnection import DbConnection
from utils import utils
import hashlib
from repository.models import *


class UserRepository:
    def __init__(self):
        self.config = Config.get('database')
        DbConnection.conn = psycopg2.connect(
            database=self.config.get('name'),
            user=self.config.get('user'),
            password=self.config.get('password'),
            host=self.config.get('host'),
            port=self.config.get('port'))

    def register(self, user_name, password):
        '''
        return "user exist"
        return None on success
        '''
        sql = f'''SELECT * FROM users
                           WHERE username = '{user_name}';'''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with DbConnection.conn.cursor() as cur:
            cur.execute(sql)
            row = cur.fetchone()

            if row is not None:
                return "user exist"

        pwd_salt = utils.rand_str()
        pwd_hash = hashlib.sha256((password+pwd_salt).encode()).hexdigest()
        sql = f'''INSERT INTO users(username, password_salt, password_hash, total_order_count, abandon_order_count) 
                         VALUES (%s,%s,%s,0,0);'''
        with DbConnection.conn.cursor() as cur:
            cur.execute(sql,(user_name,pwd_salt,pwd_hash))
            DbConnection.conn.commit()
        return None

    def login(self, user_name, password):
        '''
        return None if authentication fails
        '''
        sql = f'''SELECT * FROM users
                           WHERE username = '{user_name}';'''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with DbConnection.conn.cursor() as cur:
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
                expire = utils.get_time() + int(Config.get('service').get('tokenExpire'))

                token_sql = f'''DELETE FROM session
                                WHERE user_id = {row[f2i["id"]]};
                                INSERT INTO session(token, expire, user_id)
                                VALUES(%s, %s, %s);'''
                cur.execute(token_sql,(token,expire,row[f2i["id"]]))
                DbConnection.conn.commit()
                return LoginEntity(token,row[f2i["id"]])


    def get_user(self, user_id):
        '''
        return None if user doesn't exist
        '''
        sql = f'''SELECT * FROM users
                           WHERE id = {user_id};'''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with DbConnection.conn.cursor() as cur:
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

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with DbConnection.conn.cursor() as cur:
            cur.execute(get_id_sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            if row is None:
                # token doesn't exist
                return None

            if row[f2i['expire']] < utils.get_time():
                # token has expired, delete it
                cur.execute(delete_token_sql)
                DbConnection.conn.commit()
                return None

            return row[f2i['user_id']]

    def get_driver_data(self, driver_data_id):
        '''
        driver_data exists
        '''
        sql = f'''SELECT * FROM driver_datas
                  WHERE id = {driver_data_id};'''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with DbConnection.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            return DriverDataEntity(
                row[f2i['id']],
                row[f2i['vehicle_name']],
                row[f2i['vehicle_plate']],
                row[f2i['passenger_count']])
        
    def create_driver(self, user_id, vehicle_name, vehicle_plate, passenger_count):
        '''
        return "Invalid passenger count"
        return None on success
        '''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        sql = f'''INSERT INTO driver_datas (vehicle_name, vehicle_plate, passenger_count)
                  VALUES (%s, %s, %s)
                  RETURNING id;'''
        
        if passenger_count < 1:
            return "Invalid passenger count"
        else:
            with DbConnection.conn.cursor() as cur:
                cur.execute(sql, (vehicle_name, vehicle_plate, passenger_count))
                data_id = cur.fetchone()[0]
                update_sql = f'''UPDATE users
                                 SET driver_data_id = {data_id}
                                 WHERE id = {user_id};'''
                cur.execute(update_sql)
                DbConnection.conn.commit()
            return None
        
    def edit_driver(self, data_id, vehicle_name, vehicle_plate, passenger_count):
        '''
        unused
        '''
        sql = f'''UPDATE driver_datas
                  SET vehicle_name = %s, vehicle_plate = %s, passenger_count = %s
                  WHERE id = {data_id};'''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        if passenger_count < 1:
            return None
        else:
            with DbConnection.conn.cursor() as cur:
                cur.execute(sql,(vehicle_name, vehicle_plate, passenger_count))
                DbConnection.conn.commit()
            return DriverDataEntity(data_id, vehicle_name, vehicle_plate, passenger_count)

    def add_total_order_count(self, user_id, num):
        '''
        user exists
        '''
        sql = f'''UPDATE users
                  SET total_order_count = total_order_count + {num}
                  WHERE id = {user_id};'''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with DbConnection.conn.cursor() as cur:
            cur.execute(sql)
            DbConnection.conn.commit()

    def add_abandon_order_count(self, user_id, num):
        '''
        user exists
        '''
        sql = f'''UPDATE users
                  SET abandon_order_count = abandon_order_count + {num}
                  WHERE id = {user_id};'''

        # check connection
        try:
            with DbConnection.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            DbConnection.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with DbConnection.conn.cursor() as cur:
            cur.execute(sql)
            DbConnection.conn.commit()
