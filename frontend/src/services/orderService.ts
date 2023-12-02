import { get, post, put, remove } from './APIHelper';

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

export {
  postPassengerOrder
}