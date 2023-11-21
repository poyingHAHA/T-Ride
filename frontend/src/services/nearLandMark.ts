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

export {
  getNearLandMark,
}