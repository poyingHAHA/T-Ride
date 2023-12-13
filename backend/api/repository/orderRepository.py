import psycopg2
from utils.config import Config
from utils.dbConnection import DbConnection
from repository.models import *


class OrderRepository:
    def __init__(self):
        self.config = Config.get('database')
        DbConnection.conn = psycopg2.connect(
            database=self.config.get('name'),
            user=self.config.get('user'),
            password=self.config.get('password'),
            host=self.config.get('host'),
            port=self.config.get('port'))

    def get_unfinished_driver_orders(self, user_id):
        '''
        user exists
        '''
        sql = f'''SELECT * FROM driver_orders
                  WHERE user_id = {user_id}
                  AND NOT finished;'''

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

        return self.__sql_get_passenger_orders(sql)

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
            DbConnection.conn.commit()

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
                      arrival_time,
                      spot_id,
                      finished)
                  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                  RETURNING id;'''

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
                passenger_order_entity.arrival_time,
                passenger_order_entity.spot_id,
                passenger_order_entity.finished))
            order_id = cur.fetchone()[0]
            DbConnection.conn.commit()

        return order_id

    def _get_all_spots(self):
        sql = '''SELECT * FROM spots;'''

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
            rows = cur.fetchall()

        return [SpotEntity(
            row[f2i['id']],
            row[f2i['point']],
            row[f2i['name']]) for row in rows]

    def get_spot(self, spot_id):
        '''
        return None if spot doesn't exist
        '''
        sql = f'''SELECT * FROM spots
                  WHERE id = {spot_id}'''

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

        return SpotEntity(
            row[f2i['id']],
            row[f2i['point']],
            row[f2i['name']])

    def get_driver_order(self, order_id):
        '''
        return None if order doesn't exist
        '''
        sql = f'''SELECT * FROM driver_orders
                  WHERE id = {order_id};'''

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
                row[f2i['arrival_time']],
                row[f2i['spot_id']],
                row[f2i['finished']])

    def finish_driver_order(self, order_id):
        '''
        order exists and isn't finished,
        related passenger orders are finished

        return None on success
        '''
        sql = f'''UPDATE driver_orders
                         SET finished = true
                         WHERE id = {order_id};'''

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

    def finish_passenger_order(self, order_id):
        '''
        order exists and isn't finished

        return None on success
        '''
        sql = f'''UPDATE passenger_orders
                  SET finished = true
                  WHERE id = {order_id};'''

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

    def delete_driver_order(self, order_id):
        '''
        order exists and isn't finished

        return None on success
        '''
        order_sql = f'''DELETE FROM driver_orders
                        WHERE id = {order_id};'''
        match_sql = f'''DELETE FROM matches
                        WHERE driver_order_id = {order_id};'''

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
            cur.execute(match_sql);
            cur.execute(order_sql);
            DbConnection.conn.commit()

    def delete_passenger_order(self, order_id):
        '''
        order exists and isn't finished

        return None on success
        '''
        order_sql = f'''DELETE FROM passenger_orders
                        WHERE id = {order_id};'''
        match_sql = f'''DELETE FROM matches
                        WHERE passenger_order_id = {order_id};'''

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
            cur.execute(match_sql);
            cur.execute(order_sql);
            DbConnection.conn.commit()

    def get_all_spots(self, departure_time, with_passenger):
        time_range = int(Config.get('service').get('searchPassengerTimeRange'))

        if with_passenger:
            sql = f'''SELECT spots.*, COUNT(spot_id) AS order_count
                      FROM spots JOIN passenger_orders
                      ON spots.id = spot_id
                      WHERE NOT (time1 > {departure_time + time_range}
                      OR time2 < {departure_time - time_range})
                      AND NOT finished
                      GROUP BY spots.id;'''
        else:
            sql = f'''SELECT spots.*, COUNT(spot_id) AS order_count
                      FROM spots LEFT JOIN passenger_orders
                      ON spots.id = spot_id
                      AND NOT (time1 > {departure_time + time_range}
                      OR time2 < {departure_time - time_range})
                      AND NOT finished
                      GROUP BY spots.id;'''

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

            rows = cur.fetchall()

        return [SpotWithCountEntity(
            row[f2i['id']],
            row[f2i['point']],
            row[f2i['name']],
            row[f2i['order_count']]) for row in rows]

    def get_spot_passenger_orders(self, spot_id, departure_time):
        '''
        spot exists
        '''
        time_range = int(Config.get('service').get('searchPassengerTimeRange'))
        sql = f'''SELECT * FROM passenger_orders
                  WHERE spot_id = {spot_id}
                  AND NOT (time1 > {departure_time + time_range}
                      OR time2 < {departure_time - time_range})
                  AND NOT finished;'''

        return self.__sql_get_passenger_orders(sql)

    def get_invited_orders(self, order_id):
        '''
        order exists
        '''
        sql = f'''SELECT passenger_orders.*
                  FROM passenger_orders JOIN matches
                  ON passenger_orders.id = matches.passenger_order_id
                  WHERE matches.driver_order_id = {order_id}
                  AND NOT matches.accepted;'''

        return self.__sql_get_passenger_orders(sql)

    def get_driver_related_orders(self, order_id):
        '''
        order exists
        '''
        sql = f'''SELECT passenger_orders.* FROM passenger_orders
                  JOIN matches ON passenger_orders.id = matches.passenger_order_id
                  WHERE matches.driver_order_id = {order_id}
                  AND matches.accepted;'''

        return self.__sql_get_passenger_orders(sql)

    def get_passenger_related_order(self, order_id):
        '''
        order exists

        return None if no related order
        '''
        sql = f'''SELECT driver_orders.* FROM driver_orders
                  JOIN matches ON driver_orders.id = matches.driver_order_id
                  WHERE matches.passenger_order_id = {order_id}
                  AND matches.accepted;'''

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

    def get_passenger_invitation_orders(self, order_id):
        '''
        order exists
        '''
        sql = f'''SELECT driver_orders.* FROM matches
                  JOIN driver_orders ON driver_orders.id = matches.driver_order_id
                  WHERE passenger_order_id = {order_id}
                  AND NOT matches.accepted;'''

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

    def update_passenger_arrival_time(self, order_id, arrival_time):
        '''
        order exists
        '''
        sql = f'''UPDATE passenger_orders
                  SET arrival_time = {arrival_time}
                  WHERE id = {order_id};'''

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

    def __sql_get_passenger_orders(self, sql):
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
            row[f2i['arrival_time']],
            row[f2i['spot_id']],
            row[f2i['finished']]) for row in rows]
