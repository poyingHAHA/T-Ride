import { get, post, put, remove } from './APIHelper';
import { SpotDTO, orderDTO } from '../DTO/orders';

interface NearLandMarkRequest {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
}
const getNearLandMark = async (params: NearLandMarkRequest) => {
  if (!params.radius) params.radius = 500;
  if (!params.type) params.type = 'convenience_store';
  try {
    const response = await get(`/nearPlaces?lat=${params.lat}&lng=${params.lng}`);
    // const response = await axios.get(`http://localhost:5050/nearPlaces?lat=${params.lat}&lng=${params.lng}`)
    return response;
  } catch (error) {
    console.log("nearLandMark -> getNearLandMark error: ", error);
    return Promise.reject(error);
  }
}


// all: 0, 1，0: 全部，1: 只顯示有訂單的
const getSpots = async (departureTime: number, all: number) => {
   // 測試用
  departureTime = 1701081800;
  all = 0;
  // ====================
  try {
    const response: any = await get(`/order/passenger/spot/all?departureTime=${departureTime}&withPassenger=${all}`);
    const data: SpotDTO[] = response.data;
    // return response;
    return data;
  } catch (error) {
    console.log("nearLandMark -> getSpots error: ", error);
    return Promise.reject(error);
  }
}

const getSpotOrders = async (spotId: number, departureTime: number) => {
  // 測試用
  departureTime = 1701081800;
  // ====================
  try {
    const response: any = await get(`/order/passenger/spot/${spotId}?departureTime=${departureTime}`);
    const data: orderDTO[] = response.data;

    return data;
  } catch (error) {
    console.log("nearLandMark -> getSpotOrders error: ", error);
    return Promise.reject(error);
  }
}

export {
  getSpots,
  getSpotOrders
}