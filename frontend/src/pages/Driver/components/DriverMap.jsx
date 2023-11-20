import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, OverlayView } from "@react-google-maps/api";
import AdvMarker from "./AdvancedMarker"

const markers = [
  {
    id: 1,
    name: "A",
    position: {
      lat: 25.0174525,
      lng: 121.545246,
    }
  },
  {
    id: 2,
    name: "B",
    position: {
      lat: 25.0374525,
      lng: 121.565246,
    }
  },
  {
    id: 3,
    name: "C",
    position: {
      lat: 25.0024525,
      lng: 121.525246,
    }
  },
]

const DriverMap = () => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const location = { ...locationReducer}
  const [activeMarker, setActiveMarker] = useState(null);

  const defaultProps = {
    center: {
      lat: location.latitude,
      lng: location.longitude
    },
    zoom: 15
  };

  // useJsApiLoader hook to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    libraries: ["marker"]
  });

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  }


  return <>
      <div className="h-screen w-full">
        {isLoaded && (
          <GoogleMap
            center={defaultProps.center}
            zoom={defaultProps.zoom}
            onClick={() => {setActiveMarker(null)}}
            mapContainerStyle={{ height: "100vh", width: "100%" }}
            options={{
              mapId: "955417d2092c184d"
            }}
          >
            
            {/* if(mapRef.current) {
              console.log(mapRef.current)
            } */}
            
            <AdvMarker
              position={defaultProps.center}
            >
              <div className="border-solid border-black h-5 w-6 text-white bg-black"  >
                here
              </div>
            </AdvMarker>

            {/* {
              markers.map(({id, name, position}) => {
                return (
                <MarkerF
                  key={id} 
                  position={position} 
                  onClick={() => {handleActiveMarker(id)}}
                  label={"label"}
                  title={"title"}
                > 
                  {activeMarker === id ? (
                      <InfoWindowF onCloseClick={() => {setActiveMarker(null)}}>
                        <div>{name}</div>
                      </InfoWindowF>
                    ) : null}
                </MarkerF>
                )
              })
            } */}
          </GoogleMap>
        )}
      </div>
  </>
}

export default DriverMap;