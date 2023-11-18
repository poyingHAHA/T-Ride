import json


def to_json(obj):
    return json.dumps(obj, default=lambda o: o.__dict__, sort_keys=True, indent=2)


def is_keys_in_body(body, keys):
    pass
