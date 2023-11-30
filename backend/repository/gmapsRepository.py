import math 
import googlemaps
from utils.config import ConfigUtil


class GmapsRepository:
    def __init__(self):
        config = ConfigUtil.get('googleMapsApi')

        self.test = bool(int(config.get('test')))

        if not self.test:
            self.gmaps = googlemaps.Client(key=config.get('api_key'))

    def get_estimate_time(self, point1, point2, departure_time=None):
        '''
        points are valid

        return None if can't estimate
        return in seconds
        '''
        if self.test: 
            return self.get_distance(point1, point2, departure_time) // 10
    
        # 使用 Distance Matrix API 計算行車預計時間
        try:
            result = self.gmaps.distance_matrix(
                point1,
                point2,
                mode="driving",
                units="metric",
                departure_time=departure_time)

            # 檢查回傳結果 
            if result['status'] == 'OK':
                return result['rows'][0]['elements'][0]['duration']['value']
            else:
                return None 

        except:
            return None 


    def get_distance(self, point1, point2, departure_time=None):
        '''
        points are valid

        return None if can't get distance
        return in meters
        '''
        lat1, lng1 = map(float, point1.split(','))
        lat2, lng2 = map(float, point2.split(','))

        if self.test: 
            return self.haversine(lat1, lng1, lat2, lng2) 

        # 使用 Distance Matrix API 計算距離
        try:
            result = self.gmaps.distance_matrix(
                point1,
                point2,
                mode="driving",
                units="metric",
                departure_time=departure_time)

            # 檢查回傳結果 
            if result['status'] == 'OK':
                return result['rows'][0]['elements'][0]['distance']['value']
            else:
                return None 

        except:
            return None 


    def haversine(self, lat1, lng1, lat2, lng2):
        '''
        使用球面三角法（Haversine公式）來估算兩個地點之間的距離
        '''
        # 將經緯度轉換為弧度
       
        lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
      
        # Haversine 公式
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        # 地球半徑（公里），可以根據需要更改
        radius = 6371 

        # 計算距離
        distance =  radius * 1000 * c
        return int(distance)
