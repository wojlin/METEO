import json


def read_config(path: str) -> dict:
    with open(path) as f:
        return json.loads(f.read())
