import psycopg2
from utils.config import ConfigUtil
from repository.userRepository import *


class OrderRepository:
    def __init__(self):
        config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=config.get('name'),
            user=config.get('user'),
            password=config.get('password'),
            host=config.get('host'),
            port=config.get('port'))
        self.userRepository = UserRepository()

    def get_unfinished_driver_orders(self, user_id):
        '''
        user exists
        '''
        sql = f'''SELECT * FROM driver_orders
                  WHERE user_id = {user_id}
                  AND NOT finished;'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()
            
            return [DriverOrderEntity(
                row[f2i['id']],
                row[f2i['user_id']],
                row[f2i['time']],
                row[f2i['start_point']],
                row[f2i['start_name']],
                row[f2i['end_point']],
                row[f2i['end_name']],
                row[f2i['passenger_count']],
                row[f2i['finished']]) for row in rows]

    def get_unfinished_passenger_orders(self, user_id):
        '''
        user exists
        '''
        sql = f'''SELECT * FROM passenger_orders
                  WHERE user_id = {user_id}
                  AND NOT finished;'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()

            return [PassengerOrderEntity(
                row[f2i['id']],
                row[f2i['user_id']],
                row[f2i['time1']],
                row[f2i['time2']],
                row[f2i['people']],
                row[f2i['start_point']],
                row[f2i['start_name']],
                row[f2i['end_point']],
                row[f2i['end_name']],
                row[f2i['fee']],
                row[f2i['spot_id']],
                row[f2i['finished']]) for row in rows]


class DriverOrderEntity:
    def __init__(self, order_id, user_id, departure_time, start_point, start_name, end_point, end_name, passenger_count, finished):
        self.order_id = order_id
        self.user_id = user_id
        self.departure_time = departure_time
        self.start_point = start_point
        self.start_name = start_name
        self.end_point = end_point
        self.end_name = end_name
        self.passenger_count = passenger_count
        self.finished = finished


class PassengerOrderEntity:
    def __init__(self, order_id, user_id, departure_time1, departure_time2, passenger_count, start_point, start_name, end_point, end_name, fee, spot_id, finished):
        self.order_id = order_id
        self.user_id = user_id
        self.departure_time1 = departure_time1
        self.departure_time2 = departure_time2
        self.passenger_count = passenger_count
        self.start_point = start_point
        self.start_name = start_name
        self.end_point = end_point
        self.end_name = end_name
        self.fee = fee
        self.spot_id = spot_id
        self.finished = finished
