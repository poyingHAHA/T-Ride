import { get, post, put, remove } from './APIHelper';

const getDriverInvitations = async (passengerOrderId:number) => {
  try {
    const response: any = await get(`/match/passenger/invitation/total/${passengerOrderId}`);
    console.log("getDriverInvitations response: ", response);
    return response;
  } catch (error) {
    console.log("getDriverInvitations error: ", error);
  }
}

export {
    getDriverInvitations
}