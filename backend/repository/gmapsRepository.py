import math 
import googlemaps
from utils.config import ConfigUtil


class GmapsRepository:
    def __init__(self):
        config = ConfigUtil.get('googleMapsApi')

        self.test = config.get('test')
        self.gmaps = googlemaps.Client(key=config.get('api_key'))

    def get_distance(self, point1, point2, departure_time = None):
        '''
        points are valid
        return in meters(string format)
        '''
        
        lat1, long1 = map(float, point1.split(','))
        lat2, long2 = map(float, point2.split(','))
        
        if self.test == 'true': 
            return self.haversine(lat1, long1, lat2, long2) 
    
        # 使用 Distance Matrix API 計算距離
        try:
            result = self.gmaps.distance_matrix(point1, point2, mode="driving", units="metric", departure_time=departure_time)

            # 檢查回傳結果 
            if result['status'] == 'OK':
                distance = result['rows'][0]['elements'][0]['distance']['value']
                
                return distance
            else:
                return None 
                
        except:
            return None 


    def haversine(self, lat1, lon1, lat2, lon2):
        '''
        使用球面三角法（Haversine公式）來估算兩個地點之間的距離
        '''
        # 將經緯度轉換為弧度
       
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
      
        # Haversine 公式
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        # 地球半徑（公里），可以根據需要更改
        radius = 6371 

        # 計算距離
        distance =  radius * 1000 * c
        return distance