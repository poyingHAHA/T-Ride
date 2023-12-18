export interface orderDTO {
  "orderId": number,
  "userId": number,
  "spotId": number,
  "startPoint": {
    "lng": number,
    "lat": number
  },
  "startName": string,
  "endPoint": {
    "lng": number,
    "lat": number
  },
  "endName": string,
  "pickTime1": number,
  "pickTime2": number,
  "arrivalTime": number,
  "passengerCount": number,
  "fee": number,
  "invitationStatus": {
    "invitated": boolean,
    "accepted": boolean
  }
}

export interface driverOrderDTO {
  "orderId": number,
  "userId": number,
  "startPoint": {
    "lat": number,
    "lng": number
  },
  "startName": string,
  "endPoint": {
    "lat": number,
    "lng": number
  },
  "endName": string,
  "departureTime": number,
  "passengerCount": number
}

export interface passengerOrderDTO {
  arrivalTime: number,
  departureTime1: number,
  departureTime2: number,
  endName: string,
  endPoint: {
    lat: number,
    lng: number
  },
  fee: number,
  orderId: number,
  passengerCount: number,
  startName: string,
  startPoint: {
    lat: number,
    lng: number
  }, 
  userId: number,
  accepted?: boolean
}

export interface driverInvitationDTO {
  accepted: boolean,
  passengerOrder: passengerOrderDTO
}

export interface driverInvitationTotalDTO {
  invitations: driverInvitationDTO[];
}

export interface SpotDTO {
  name: string;
  order_count: number;
  point: {
    lat: number;
    lng: number;
  },
  spot_id: number;
}