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
            rows = pd.DataFrame(cur.fetchall(), columns=[d[0] for d in cur.description])

            if len(rows) == 0:
                return None

            user_id = rows['id'].values[0]
            user_name = rows['username'].values[0]
            total_order_count = rows['total_order_count'].values[0]
            abandon_order_count = rows['abandon_order_count'].values[0]
            driver_data_id = rows['driver_data_id'].values[0]

            if driver_data_id != None:
                cur.execute(get_driver_data_sql.format(driver_data_id))
                rows = pd.DataFrame(cur.fetchall(), columns=[d[0] for d in cur.description])

                driver_data = DriverDataEntity(
                    rows['vehicle_name'].values[0],
                    rows['vehicle_plate'].values[0],
                    rows['passenger_count'].values[0])
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
