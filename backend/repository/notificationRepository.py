import psycopg2
from utils.config import ConfigUtil
import httpx


class NotificationRepository:
    def __init__(self):
        self.config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=self.config.get('name'),
            user=self.config.get('user'),
            password=self.config.get('password'),
            host=self.config.get('host'),
            port=self.config.get('port'))
        self.client = httpx.AsyncClient()

    def register_host_port(self, user_id, host_port):
        sql = f'''INSERT INTO websocket
                  VALUES (%s, %s);'''

        # check connection
        try:
            with self.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            self.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with self.conn.cursor() as cur:
            cur.execute(sql, (user_id, host_port))
            self.conn.commit()

    def delete_host_port(self, user_id):
        sql = f'''DELETE FROM websocket
                  WHERE user_id = {user_id};'''

        # check connection
        try:
            with self.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            self.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        with self.conn.cursor() as cur:
            cur.execute(sql)
            self.conn.commit()

    async def notify_accept_invitation(self, passenger_order_id, driver_id, accepted):
        sql = f'''SELECT host_port FROM websocket
                  WHERE user_id = {driver_id};'''
        url = f'http://{{host_port}}/internal/notification/invitation/accept?driverId={driver_id}&passengerOrderId={passenger_order_id}&accepted={int(accepted)}'

        # check connection
        try:
            with self.conn.cursor() as cur:
                cur.execute('SELECT 1;')
        except (psycopg2.OperationalError, psycopg2.InterfaceError):
            self.conn = psycopg2.connect(
                database=self.config.get('name'),
                user=self.config.get('user'),
                password=self.config.get('password'),
                host=self.config.get('host'),
                port=self.config.get('port'))

        # get host:port handling the driver websocket
        with self.conn.cursor() as cur:
            cur.execute(sql)
            row = cur.fetchone()
        if row is None:
            # no host is handling the driver websocket
            return
        host_port = row[0]

        await self.client.post(url.format(host_port=host_port))
