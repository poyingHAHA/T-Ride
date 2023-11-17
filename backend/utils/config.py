import configparser


class ConfigUtil:
    config = configparser.ConfigParser()
    config.read('config.ini')

    def get(key):
        return ConfigUtil.config[key]
