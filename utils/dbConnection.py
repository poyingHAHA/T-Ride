import psycopg2
from utils.config import Config
from utils import utils


class DbConnection:
    config = Config.get('database')
    conn = psycopg2.connect(
        database=config.get('name'),
        user=config.get('user'),
        password=utils.get_db_password(),
        host=config.get('host'),
        port=config.get('port'))
