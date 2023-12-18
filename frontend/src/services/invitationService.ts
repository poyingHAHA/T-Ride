import { get, post, put, remove } from './APIHelper';
import { getTokenFromCookie } from '../utils/cookieUtil'
import { InvitationResultDTO } from '../DTO/invitation'


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

const postInvitation = async (driverOrderId: number, passengerOrderIds: number[]) => {
  try {
    const token = getTokenFromCookie();
    let invitations = []
    for (const passengerOrderId of passengerOrderIds) {
      const invitation = post(
        '/match/driver/invitation',
        JSON.stringify({
          token,
          driverOrderId,
          passengerOrderId
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      invitations.push(invitation)
    }

    const result = await Promise.all(invitations).then((responses) => {
      console.log("postInvitation responses: ", responses)
      const successInvited = responses.filter((result: any) => result.status === 200)

      return {
        success: successInvited.length,
        fail: responses.length - successInvited.length
      }
    }).catch((error) => {
      console.log("post Invitation error: ", error)
      return{
        success: 0,
        fail: passengerOrderIds.length
      }
    })

    return result
  } catch (error) {
    console.log("post Invitation error: ", error)
  }
}

export {
  getDriverInvitations,
  getPassengerAcceptedInvitations,
  acceptDriverInvitations,
  postInvitation
}