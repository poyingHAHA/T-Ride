import { get, post, put, remove } from './APIHelper';
import { getUserId } from '../utils/userUtil';

interface PostPassengerOrderRequest {
  token: string;
  startPoint: {
    lat: number;
    lng: number;
  }
  startName: string;
  endPoint: {
    lat: number;
    lng: number;
  }
  endName: string;
  departureTime1: number;
  departureTime2: number;
  passengerCount: number;
}

const postPassengerOrder = async (params: PostPassengerOrderRequest) => {
  try {
    const response = await post(
      "/order/passenger",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("postPassengerOrder response: ", response);
    return response;
  } catch (error) {
    console.log("postPassengerOrder error: ", error);
  }
}

const getPassengerUnfinishedOrder = async () => {
  const userId = getUserId();
  console.log("getPassengerUnfinishedOrder userId: ", userId);
  try {
    const response: any = await get(`/order/passenger/unfinished/${userId}`);
    console.log("getPassengerUnfinishedOrder response: ", response);
    return response;
  } catch (error) {
    console.log("getPassengerUnfinishedOrder error: ", error);
  }
}

const getPassengerOrderbyPorderID = async (orderId: number) => {
  console.log("getPassengerOrderbyPorderID orderId: ", orderId);
  try {
    const response: any = await get(`/order/passenger/${orderId}`);
    console.log("getPassengerOrderbyPorderID response: ", response);
    return response;
  } catch (error) {
    console.log("getPassengerOrderbyPorderID error: ", error);
  }
}

const deletePassengerOrder = async (orderId: number, tokens: string) => {
  try {
    const response = await remove(
      `/order/passenger/${orderId}`,
      {
        params: { token: tokens.replace(/['"]+/g, '') }
      })
    console.log("deletePassengerOrder respones: ", response)
    return response;
  } catch (error) {
    console.log("deletePassengerOrder error: ", error);
  }

}

export {
  postPassengerOrder,
  getPassengerUnfinishedOrder,
  getPassengerOrderbyPorderID,
  deletePassengerOrder
}