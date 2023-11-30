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
  "fee": number
}