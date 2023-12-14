export interface WaypointDTO {
  location?: string|google.maps.LatLng|google.maps.LatLngLiteral|
        google.maps.Place;
  stopover?: boolean;
  orderId?: number;
  pointType?: string;
  start?: boolean;
}