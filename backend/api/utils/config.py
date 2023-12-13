import configparser


class Config:
    config = configparser.ConfigParser()
    config.read('config.ini')

    def get(key):
        return Config.config[key]
