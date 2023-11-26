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
        sql = f'''INSERT INTO match_invitations (
                      driver_order_id,
                      passenger_order_id)
                  VALUES (
                      {driver_order_id},
                      {passenger_order_id});'''

        with self.conn.cursor() as cur:
            cur.execute(sql)
            self.conn.commit()

    def get_driver_invitations(self, order_id):
        '''
        order exists
        '''
        accepted_sql = f'''SELECT passenger_orders.*, matches.time
                           FROM matches JOIN passenger_orders
                           ON matches.passenger_order_id = passenger_orders.id
                           WHERE matches.driver_order_id = {order_id};'''
        unaccepted_sql = f'''SELECT passenger_orders.*
                             FROM match_invitations JOIN passenger_orders
                             ON match_invitations.passenger_order_id = passenger_orders.id
                             WHERE match_invitations.driver_order_id = {order_id};'''

        ret = []
        with self.conn.cursor() as cur:
            cur.execute(accepted_sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()
            ret.extend([InvitationEntity(
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
                row[f2i['time']],
                True) for row in rows])

            cur.execute(unaccepted_sql)
            f2i = {desc[0]: i for i, desc in enumerate(cur.description)}
            rows = cur.fetchall()
            ret.extend([InvitationEntity(
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
                -1,
                False) for row in rows])

        return ret
