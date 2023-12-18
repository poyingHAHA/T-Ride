import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
// import { getSpots, getSpotOrders } from "../../../services/orderService";
import { orderDTO } from "../../../DTO/orders";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type PassengerMapProps = {
  isLoaded: boolean;
  directions?: DirectionsResult;
  detail: boolean;
};

const PassengerMap = ({ isLoaded, directions, detail }: PassengerMapProps) => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const [currentCenter, setCurrentCenter] = useState<LatLngLiteral>({ lat: locationReducer.lat || 0, lng: locationReducer.lng || 0 });
  const location = { ...locationReducer }

  const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
  const mapRef = useRef<google.maps.Map | null>(null);

  const defaultProps = {
    center: {
      lat: passengerStartDestReducer.start.lat !== undefined ? passengerStartDestReducer.start.lat : location.lat,
      lng: passengerStartDestReducer.start.lng !== undefined ? passengerStartDestReducer.start.lng : location.lng
    },
    zoom: 15
  };

  useEffect(() => {
    // Check if the start location has been set and is not null
    if (passengerStartDestReducer.start && passengerStartDestReducer.start.lat && passengerStartDestReducer.start.lng) {
      setCurrentCenter({
        lat: passengerStartDestReducer.start.lat,
        lng: passengerStartDestReducer.start.lng
      });
    }
    // Check if the destination location has been set and is not null
    else if (passengerStartDestReducer.dest && passengerStartDestReducer.dest.lat && passengerStartDestReducer.dest.lng) {
      setCurrentCenter({
        lat: passengerStartDestReducer.dest.lat,
        lng: passengerStartDestReducer.dest.lng
      });
    }
  }, [passengerStartDestReducer.start, passengerStartDestReducer.dest]);

  // 抓取地圖中心點
  const centerChangeHandler = () => {
    if (mapRef.current) {
      const center = mapRef.current?.getCenter();
    }
  }

  return <>
    <div className="h-[100%] w-full">
      {isLoaded && (
        <>
          {
            directions && detail && (
              <div>
                <div className="absolute top-0 left-0 z-50 border border-amber-400 rounded-lg bg-white mr-4">
                  <div className="text-xs px-2 py-2 font-medium">
                    距離：{directions.routes[0].legs[0].distance && directions.routes[0].legs[0].distance.text}
                    <br />
                    時間：{directions.routes[0].legs[0].duration && directions.routes[0].legs[0].duration.text}
                  </div>
                </div>
              </div>
            )
          }
          <GoogleMap
            onLoad={(map) => { mapRef.current = map }}
            center={(currentCenter && currentCenter) || defaultProps.center as LatLngLiteral}
            zoom={defaultProps.zoom}
            mapContainerStyle={{ height: "100%", width: "100%" }}
            onCenterChanged={centerChangeHandler}
            options={{
              mapId: "955417d2092c184d",
              disableDefaultUI: true,
              clickableIcons: false,
            }}
          >
            {directions &&
              (
                <>
                  <DirectionsRenderer directions={directions} options={{
                    polylineOptions: {
                      strokeColor: "#black",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }
                  }} />
                </>
              )
            }
            {
              !passengerStartDestReducer.start.name && (
                <MarkerF
                  position={defaultProps.center as LatLngLiteral}
                  label={"Here"}
                >
                </MarkerF>
              )
            }
            {
              (passengerStartDestReducer.start.name && !directions) && (
                <MarkerF
                  position={{ lat: passengerStartDestReducer.start.lat, lng: passengerStartDestReducer.start.lng } as LatLngLiteral}
                  label={"Start"}
                >
                </MarkerF>
              )
            }
            {
              (passengerStartDestReducer.dest.name && !directions) && (
                <MarkerF
                  position={{ lat: passengerStartDestReducer.dest.lat, lng: passengerStartDestReducer.dest.lng } as LatLngLiteral}
                  label={"Dest"}
                >
                </MarkerF>
              )
            }

          </GoogleMap>
        </>
      )}
    </div>
  </>
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
export default PassengerMap;