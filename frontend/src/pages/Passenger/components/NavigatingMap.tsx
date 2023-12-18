import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type NavigatingMapProps = {
  isLoaded: boolean;
  directions?: DirectionsResult;
  driverlocation?: LatLngLiteral;
};

const NavigatingMap = ({ isLoaded, directions, driverlocation }: NavigatingMapProps) => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const [currentCenter, setCurrentCenter] = useState<LatLngLiteral>({ lat: locationReducer.lat || 0, lng: locationReducer.lng || 0 });
  const location = { ...locationReducer }
  const mapRef = useRef<google.maps.Map | null>(null);

  const defaultProps = {
    center: {
      lat: location.lat,
      lng: location.lng
    },
    zoom: 8
  };

  console.log("Passenger location: ", location);
  console.log("Driver location: ", driverlocation);


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
                    },
                    markerOptions: {
                        visible: false
                    }
                    
                  }} />
                </>
              )
            }
            {
              (
                <MarkerF
                  position={defaultProps.center as LatLngLiteral}
                  label={"You"}
                >
                </MarkerF>
              )
            }
            {
              (driverlocation !== undefined) && (
                <MarkerF
                  position={driverlocation as LatLngLiteral}
                  label={"Driver"}
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
export default NavigatingMap;