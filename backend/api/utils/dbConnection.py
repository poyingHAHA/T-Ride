import psycopg2
from utils.config import Config


class DbConnection:
    config = Config.get('database')
    conn = psycopg2.connect(
        database=config.get('name'),
        user=config.get('user'),
        password=config.get('password'),
        host=config.get('host'),
        port=config.get('port'))
