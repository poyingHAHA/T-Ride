import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, MarkerF, InfoWindowF, OverlayView } from "@react-google-maps/api";

const DriverNavigate = ({isLoaded}) =>{
  const defaultProps = {
    center: {
      lat: 25.0174525,
      lng: 121.545246,
    },
    zoom: 15
  };

  //watchPosition
  const [position, setPosition] = useState(defaultProps.center);
  useEffect(() => {
    const geo = navigator.geolocation;
    try {
      geo.getCurrentPosition(
      (pos)=>{
        console.log(pos.coords);
        setPosition({
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude
        });
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <>
      {isLoaded && (
        <div className="w-full h-screen">
          <GoogleMap
            center={position} //set to watchPosition
            zoom={defaultProps.zoom}
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={{
              mapId: "955417d2092c184d",
              disableDefaultUI: true,
              clickableIcons: false,
            }}
          >
            <MarkerF
              position={position}
              label={"Here"}
            ></MarkerF>
          </GoogleMap>
        </div>  
      )}
    </>
  );
}

export default DriverNavigate;