import googlemaps
from utils.config import ConfigUtil


class GmapsRepository:
    def __init__(self):
        return # TODO: remove it
        config = ConfigUtil.get('googlaMapsApi')
        self.gmaps = googlemaps.Client(key=config.get('api_key'))

    def get_distance(self, point1, point2):
        '''
        points are valid
        return in meters
        '''
        # TODO: this is trash
        lo1, la1 = map(float, point1.split(','))
        lo2, la2 = map(float, point2.split(','))
        return int(((lo1 - lo2) ** 2 + (la1 - la2) ** 2) ** 0.5 * 1000000)
