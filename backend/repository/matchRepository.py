import psycopg2
from utils.config import ConfigUtil
from repository.models import *


class MatchRepository:
    def __init__(self):
        config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=config.get('name'),
            user=config.get('user'),
            password=config.get('password'),
            host=config.get('host'),
            port=config.get('port'))

    def send_invitation(self, driver_order_id, passenger_order_id):
        '''
        orders exist and not finished, not matched, not invited
        '''
        sql = f'''INSERT INTO matches (
                      driver_order_id,
                      passenger_order_id,
                      accepted)
                  VALUES (
                      {driver_order_id},
                      {passenger_order_id},
                      false);'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            self.conn.commit()

    def get_driver_invitations(self, order_id):
        '''
        order exists
        '''
        sql = f'''SELECT passenger_orders.*, matches.accepted
                  FROM matches JOIN passenger_orders
                  ON matches.passenger_order_id = passenger_orders.id
                  WHERE matches.driver_order_id = {order_id};'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()

        return [InvitationEntity(
            PassengerOrderEntity(
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
                row[f2i['finished']]),
            row[f2i['accepted']]) for row in rows]
