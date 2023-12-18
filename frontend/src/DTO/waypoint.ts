export interface WaypointDTO {
  location?: string|google.maps.LatLng|google.maps.LatLngLiteral|
        google.maps.Place;
  stopover?: boolean;
  orderId: number;
  startName?: string;
  endName?: string;
  time?: number;
  pointType?: string;
  start?: boolean;
  invitationStatus?: {
    invitated: boolean,
    accepted: boolean
  };
}