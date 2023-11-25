import {get, post, put, remove} from './APIHelper';
import axios from 'axios';

interface NearLandMarkRequest {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
}

const getNearLandMark = async (params: NearLandMarkRequest) => {
  if(!params.radius) params.radius = 500;
  if(!params.type) params.type = 'convenience_store';
  try {
    const response = await get(`/nearPlaces?lat=${params.lat}&lng=${params.lng}`);
    // const response = await axios.get(`http://localhost:5050/nearPlaces?lat=${params.lat}&lng=${params.lng}`)
    return response;
  } catch (error) {
    console.log("nearLandMark -> getNearLandMark error: ", error);
    return Promise.reject(error);
  }
}

const getSpots = async (departureTime: number) => {
  try {
    // const response = await get(`/order/passenger/spot/{spotId}`);
    // return response;
    return {
      spots: [
        {
          "spotId": "ChIJxYu9PP1GaTQRExEbhFYJNWA",
          "spotName": "萊爾富便利商店 彰縣彰鼎店",
          "spotPoint": {
            "lng": 120.4796447,
            "lat": 24.0888785
          },
          "passengerCount": 2
        },
        {
          "spotId": "ChIJP_zSGB1HaTQR8IcLesVv3vo",
          "spotName": "萊爾富便利商店 彰縣鹿和店",
          "spotPoint": {
            "lng": 120.484256,
            "lat": 24.0902667
          },
          "passengerCount": 2
        },
        {
          "spotId": "ChIJSS6m1_hGaTQRqbLFH1YWnts",
          "spotName": "7-ELEVEn 鹿棋門市",
          "spotPoint": {
            "lng": 120.4754899,
            "lat": 24.0825746
          },
          "passengerCount": 2
        },
        {
          "spotId": "ChIJFacMLe9HaTQRfVH0anPB3zY",
          "spotName": "7-11 頂王門市",
          "spotPoint": {
            "lng": 120.4770952,
            "lat": 24.0912934
          },
          "passengerCount": 2
        },
        {
          "spotId": "ChIJ5fFgDvVHaTQRXHX-HDBzp2o",
          "spotName": "全家便利商店 鹿港柑仔店",
          "spotPoint": {
            "lng": 120.4756607,
            "lat": 24.0832663
          },
          "passengerCount": 2
        },
        {
          "spotId": "ChIJSS6m1_hGaTQRBjnuoeZF44Y",
          "spotName": "7-ELEVEn 頂番門市",
          "spotPoint": {
            "lng": 120.4801416,
            "lat": 24.08734029999999
          },
          "passengerCount": 2
        },
        {
          "spotId": "ChIJvbZnsdtHaTQRlM-tw62EPic",
          "spotName": "7-ELEVEn 鳴人門市",
          "spotPoint": {
            "lng": 120.4856189,
            "lat": 24.0917988,
          },
          "passengerCount": 2
        },
        {
          "spotId": "ChIJo7c_l_1GaTQRzcDUc-Wh06E",
          "spotName": "全家便利商店 鹿港金寶店",
          "spotPoint": {
            "lng": 120.4806387,
            "lat": 24.0863046,
          },
          "passengerCount": 3
        },
      ]
    }
  } catch (error) {
    console.log("nearLandMark -> getSpots error: ", error);
    return Promise.reject(error);
  }
}

const getSpotOrders = async (spotId: string, departtureTime: number) => {
  try {
    // const response = await get(`/order/passenger/spot/${spotId}?departureTime=${departtureTime}`);
    return {
      orders: [
        {
          "orderId": 1,
          "userId": 2,
          "startPoint": {
            "lng": 120.99777403377531,
            "lat": 24.787707214648197
          },
          "startName": "Seven XX門市",
          "endPoint": {
            "lng": 120.99777403377531,
            "lat": 24.787707214648197
          },
          "endName": "台積新竹xxx廠",
          "pickTime1": 0,
          "pickTime2": 0,
          "arrivalTime": 0,
          "passengerCount": 1,
          "fee": 100
        },
        {
          "orderId": 2,
          "userId": 3,
          "startPoint": {
            "lng": 120.99777403377531,
            "lat": 24.787707214648197
          },
          "startName": "全家 XX門市",
          "endPoint": {
            "lng": 120.99777403377531,
            "lat": 24.787707214648197
          },
          "endName": "台積台中xxx廠",
          "pickTime1": 0,
          "pickTime2": 0,
          "arrivalTime": 0,
          "passengerCount": 2,
          "fee": 200
        }
      ]
    };
  } catch (error) {
    console.log("nearLandMark -> getSpotOrders error: ", error);
    return Promise.reject(error);
  }
}
export {
  getNearLandMark,
  getSpots,
  getSpotOrders
}