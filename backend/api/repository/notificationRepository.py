import psycopg2
from utils.config import Config
from utils.dbConnection import DbConnection
import httpx


class NotificationRepository:
    def __init__(self):
        self.config = Config.get('database')
        DbConnection.conn = psycopg2.connect(
            database=self.config.get('name'),
            user=self.config.get('user'),
            password=self.config.get('password'),
            host=self.config.get('host'),
            port=self.config.get('port'))
        self.client = httpx.AsyncClient()

    def register_host_port(self, user_id, host_port):
        sql = f'''INSERT INTO websocket (
                      user_id,
                      host_port)
                  VALUES (%s, %s)
                  ON CONFLICT (user_id) DO
                  UPDATE SET host_port = %s;'''

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
            cur.execute(sql, (user_id, host_port, host_port))
            DbConnection.conn.commit()

    async def notify_send_invitation(self, passenger_id, driver_order_id, passenger_order_id):
        url = f'http://{{host_port}}/internal/notification/invitation/send?passengerOrderId={passenger_order_id}&driverOrderId={driver_order_id}'

        await self.__notify_send_websocket(passenger_id, url)

    async def notify_accept_invitation(self, driver_id, passenger_order_id, driver_order_id, accepted):
        url = f'http://{{host_port}}/internal/notification/invitation/accept?driverOrderId={driver_order_id}&passengerOrderId={passenger_order_id}&accepted={int(accepted)}'

        await self.__notify_send_websocket(driver_id, url)

    async def send_driver_position(self, passenger_id, passenger_order_id, position):
        url = f'http://{{host_port}}/internal/position/send?passengerOrderId={passenger_order_id}&position={position}'

        await self.__notify_send_websocket(passenger_id, url)

    async def __notify_send_websocket(self, user_id, internal_url):
        sql = f'''SELECT host_port FROM websocket
                  WHERE user_id = {user_id};'''

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

        # get host:port handling the user websocket
        with DbConnection.conn.cursor() as cur:
            cur.execute(sql)
            row = cur.fetchone()
        if row is None:
            # no host is handling the user websocket
            return
        host_port = row[0]

        await self.client.post(internal_url.format(host_port=host_port))
