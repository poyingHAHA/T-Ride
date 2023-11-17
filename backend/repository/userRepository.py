import psycopg2
import pandas as pd
from utils.config import ConfigUtil


class UserRepository:
    def __init__(self):
        config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=config.get('name'),
            user=config.get('user'),
            password=config.get('password'),
            host=config.get('host'),
            port=config.get('port'))

    def get_user(self, user_id):
        '''
        return None if user doesn't exist
        driver_data = None if not found
        '''
        get_user_sql = f'''SELECT * FROM users
                           WHERE id = {user_id};'''
        get_driver_data_sql = '''SELECT * FROM driver_datas
                                 WHERE id = {};'''

        with self.conn.cursor() as cur:
            cur.execute(get_user_sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchone()

            if len(rows) == 0:
                return None

            user_id = rows[f2i['id']]
            user_name = rows[f2i['username']]
            total_order_count = rows[f2i['total_order_count']]
            abandon_order_count = rows[f2i['abandon_order_count']]
            driver_data_id = rows[f2i['driver_data_id']]

            if driver_data_id != None:
                cur.execute(get_driver_data_sql.format(driver_data_id))
                f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
                rows = cur.fetchone()

                driver_data = DriverDataEntity(
                    rows[f2i['vehicle_name']],
                    rows[f2i['vehicle_plate']],
                    rows[f2i['passenger_count']])
            else:
                driver_data = None

            return UserEntity(
                user_id,
                user_name,
                total_order_count,
                abandon_order_count,
                driver_data)


class UserEntity:
    def __init__(self, user_id, user_name, total_order_count, abandon_order_count, driver_data):
        self.user_id = user_id
        self.user_name = user_name
        self.total_order_count = total_order_count
        self.abandon_order_count = abandon_order_count
        self.driver_data = driver_data


class DriverDataEntity:
    def __init__(self, vehicle_name, vehicle_plate, passenger_count):
        self.vehicle_name = vehicle_name
        self.vehicle_plate = vehicle_plate
        self.passenger_count = passenger_count
