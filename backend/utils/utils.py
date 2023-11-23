import json
from datetime import datetime
import random,string


def to_json(obj):
    return json.dumps(obj, default=lambda o: o.__dict__, sort_keys=True, indent=2)


def is_keys_in_body(body, keys):
    for key in keys:
        if key not in body:
            return False
    return True


def is_keys_in_query(request, keys):
    for key in keys:
        if key not in request.args:
            return False
    return True


def get_time():
    # utc time
    return int(datetime.utcnow().timestamp())

def rand_str():
    return ''.join(random.choice(string.ascii_letters + string.digits) for x in range(64))