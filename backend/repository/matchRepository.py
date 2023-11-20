import psycopg2
from utils.config import ConfigUtil


class MatchRepository:
    def __init__(self):
        config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=config.get('name'),
            user=config.get('user'),
            password=config.get('password'),
            host=config.get('host'),
            port=config.get('port'))

    def get_matches(self, driver_order_id):
        '''
        order exists
        '''
        sql = f'''SELECT * FROM matches
                  WHERE driver_order_id = {driver_order_id};'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()

        return [MatchEntity(
            row[f2i['id']],
            row[f2i['driver_order_id']],
            row[f2i['passenger_order_id']],
            row[f2i['time']]) for row in rows]


class MatchEntity():
    def __init__(self, match_id, driver_order_id, passenger_order_id, departure_time):
        self.match_id = match_id
        self.driver_order_id = driver_order_id
        self.passenger_order_id = passenger_order_id
        self.departure_time = departure_time
