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


class MatchEntity():
    def __init__(self, match_id, driver_order_id, passenger_order_id, departure_time):
        self.match_id = match_id
        self.driver_order_id = driver_order_id
        self.passenger_order_id = passenger_order_id
        self.departure_time = departure_time
