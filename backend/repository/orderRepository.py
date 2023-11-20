import psycopg2
from utils.config import ConfigUtil


class OrderRepository:
    def __init__(self):
        config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=config.get('name'),
            user=config.get('user'),
            password=config.get('password'),
            host=config.get('host'),
            port=config.get('port'))

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

    def create_driver_order(self, driver_order_entity):
        '''
        order is valid
        return order_id
        '''
        sql = f'''INSERT INTO driver_orders (
                      user_id,
                      time,
                      start_point,
                      start_name,
                      end_point,
                      end_name,
                      passenger_count,
                      finished)
                  VALUES (%s, %s, %s, %s, %s ,%s, %s, %s)
                  RETURNING id;'''

        with self.conn.cursor() as cur:
            cur.execute(sql, (
                driver_order_entity.user_id,
                driver_order_entity.departure_time,
                driver_order_entity.start_point,
                driver_order_entity.start_name,
                driver_order_entity.end_point,
                driver_order_entity.end_name,
                driver_order_entity.passenger_count,
                driver_order_entity.finished))
            order_id = cur.fetchone()[0]
            self.conn.commit()

        return order_id

    def create_passenger_order(self, passenger_order_entity):
        '''
        order is valid
        return order_id
        '''
        sql = f'''INSERT INTO passenger_orders (
                      user_id,
                      time1,
                      time2,
                      people,
                      start_point,
                      start_name,
                      end_point,
                      end_name,
                      fee,
                      spot_id,
                      finished)
                  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                  RETURNING id;'''

        with self.conn.cursor() as cur:
            cur.execute(sql, (
                passenger_order_entity.user_id,
                passenger_order_entity.departure_time1,
                passenger_order_entity.departure_time2,
                passenger_order_entity.passenger_count,
                passenger_order_entity.start_point,
                passenger_order_entity.start_name,
                passenger_order_entity.end_point,
                passenger_order_entity.end_name,
                passenger_order_entity.fee,
                passenger_order_entity.spot_id,
                passenger_order_entity.finished))
            order_id = cur.fetchone()[0]
            self.conn.commit()

        return order_id

    def get_all_spots(self):
        sql = '''SELECT * FROM spots;'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()

        return [SpotEntity(
            row[f2i['id']],
            row[f2i['point']],
            row[f2i['name']]) for row in rows]

    def get_driver_order(self, order_id):
        '''
        return None if order doesn't exist
        '''
        sql = f'''SELECT * FROM driver_orders
                  WHERE id = {order_id};'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            if row is None:
                return None

            return DriverOrderEntity(
                row[f2i['id']],
                row[f2i['user_id']],
                row[f2i['time']],
                row[f2i['start_point']],
                row[f2i['start_name']],
                row[f2i['end_point']],
                row[f2i['end_name']],
                row[f2i['passenger_count']],
                row[f2i['finished']])

    def get_passenger_order(self, order_id):
        '''
        return None if order doesn't exist
        '''
        sql = f'''SELECT * FROM passenger_orders
                  WHERE id = {order_id};'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            row = cur.fetchone()

            if row is None:
                return None

            return PassengerOrderEntity(
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
                row[f2i['finished']])

    def finish_driver_order(self, order_id):
        '''
        order exists and isn't finished

        return "related passenger order isn't finished"

        return None on success
        '''
        finish_sql = f'''UPDATE driver_orders
                         SET finished = true
                         WHERE id = {order_id};'''
        related_order_sql = f'''SELECT passenger_orders.finished FROM passenger_orders
                                JOIN matches ON passenger_orders.id = matches.passenger_order_id
                                WHERE matches.driver_order_id = {order_id};'''

        with self.conn.cursor() as cur:
            cur.execute(related_order_sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()
            for row in rows:
                if not row[f2i['finished']]:
                    return "related passenger order isn't finished"

            cur.execute(finish_sql)
            self.conn.commit()

    def finish_passenger_order(self, order_id):
        '''
        order exists and isn't finished

        return None on success
        '''

        sql = f'''UPDATE passenger_orders
                  SET finished = true
                  WHERE id = {order_id};'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            self.conn.commit()


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


class SpotEntity:
    def __init__(self, spot_id, point, name):
        self.spot_id = spot_id
        self.point = point
        self.name = name
