import { get, post, put, remove } from './APIHelper';


interface AcceptDriverInvitations {
  token: string,
  driverOrderId: number,
  passengerOrderId: number
}


const getDriverInvitations = async (passengerOrderId: number) => {
  try {
    const response: any = await get(`/match/passenger/invitation/total/${passengerOrderId}`);
    console.log("getDriverInvitations response: ", response);
    return response;
  } catch (error) {
    console.log("getDriverInvitations error: ", error);
  }
}


const getPassengerAcceptedInvitations = async (passengerOrderId: number) => {
  try {
    const response: any = await get(`/match/passenger/accepted/${passengerOrderId}`);
    console.log("getPassengerAcceptedInvitations response: ", response);
    return response;
  } catch (error) {
    console.log("getPassengerAcceptedInvitations error: ", error);
  }
}


const acceptDriverInvitations = async (params: AcceptDriverInvitations) => {
  try {
    const response = await post(
      "/match/passenger/invitation/accept",
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("acceptDriverInvitations response: ", response);
    return response;
  } catch (error) {
    console.log("acceptDriverInvitations error: ", error);
  }
}

export {
  getDriverInvitations,
  getPassengerAcceptedInvitations,
  acceptDriverInvitations
}