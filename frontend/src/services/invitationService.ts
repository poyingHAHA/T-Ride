import { get, post, put, remove } from './APIHelper';
import { getTokenFromCookie } from '../utils/cookieUtil'
import { InvitationResultDTO } from '../DTO/invitation'

const getDriverInvitations = async (passengerOrderId:number) => {
  try {
    const response: any = await get(`/match/passenger/invitation/total/${passengerOrderId}`);
    console.log("getDriverInvitations response: ", response);
    return response;
  } catch (error) {
    console.log("getDriverInvitations error: ", error);
  }
}

const postInvitation = async (driverOrderId:number, passengerOrderIds: number[]) => {
  try{
    const token = getTokenFromCookie();
    let invitations = []
    for(const passengerOrderId of passengerOrderIds){
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

    Promise.all(invitations).then((responses) => {
      const successInvited = responses.filter((result: any) => result.status ===200)
      
      return {
        success: successInvited.length,
        fail: responses.length - successInvited.length
      }
    }).catch((error) => {
      console.log("post Invitation error: ", error)
    })

    return {
      success: 0,
      fail: 0
    } as InvitationResultDTO
  } catch (error){
    console.log("post Invitation error: ", error)
  }
}

export {
    getDriverInvitations,
    postInvitation
}