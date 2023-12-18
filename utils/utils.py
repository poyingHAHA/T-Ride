import json
from datetime import datetime
import random,string
from utils.config import Config
import os


def to_json(obj):
    return json.dumps(obj, default=lambda o: o.__dict__, sort_keys=True, indent=2, ensure_ascii=False)


def is_keys_in_dict(d, keys):
    for key in keys:
        if key not in d:
            return False
    return True


def get_time():
    # utc time
    return int(datetime.utcnow().timestamp())

def rand_str():
    return ''.join(random.choice(string.ascii_letters + string.digits) for x in range(64))

def get_db_password():
    environ_password = os.environ.get('DB_PASSWORD')
    print(f'environment db password: {environ_password}')
    return environ_password if environ_password else Config.get('database').get('password')
