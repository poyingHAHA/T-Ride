import psycopg2
from utils.config import ConfigUtil


class NotificationRepository:
    def __init__(self):
        self.config = ConfigUtil.get('database')
        self.conn = psycopg2.connect(
            database=self.config.get('name'),
            user=self.config.get('user'),
            password=self.config.get('password'),
            host=self.config.get('host'),
            port=self.config.get('port'))

    def notify_accept_invitation(self, driver_order_id, passenger_order_id, driver_id):
        sql = f'''SELECT host_port FROM websocket
                  WHERE user_id = {passenger_id};'''

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

        # get host:port handling the passenger websocket
        with self.conn.cursor() as cur:
            cur.execute(sql)
            row = cur.fetchone()

        if row is None:
            # no host is handling the passenger websocket
            return

        host_port = row[0]

        # TODO: use api to notify the host
        pass
