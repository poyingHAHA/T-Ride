import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, MarkerF, InfoWindowF, OverlayView, DirectionsRenderer, } from "@react-google-maps/api";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapProps = boolean;

const locations:LatLngLiteral[] = [
  {
    lat: 25.0174525,
    lng: 121.545246
  },
  {
    lat: 25.030361, 
    lng: 121.526034
  },
]

const DriverNavigate = () =>{
  const defaultProps = {
    zoom: 15
  };

  const [directions, setDirections] = useState<DirectionsResult>();

  const fetchDirections = (place: LatLngLiteral) => {
    const service = new google.maps.DirectionsService();
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.map(loc => {
      return {
        location: loc,
        stopover: true
      };
    });
    service.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (result && (status === "OK")) {
        setDirections(result);
      } else {
        console.log(status);
      }
    });
  };

  useEffect(() => {
    locations.forEach(place => {
      fetchDirections(place); 
    });
  }, []);

  return (
    <>
        <div className="w-full h-screen">
          <GoogleMap
            center={locations[0]}
            zoom={defaultProps.zoom}
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={{
              mapId: "955417d2092c184d",
              disableDefaultUI: true,
              clickableIcons: false,
            }}
          >
            {directions && (
              <DirectionsRenderer 
                directions={directions}
                options={{
                  polylineOptions: {
                    zIndex: 50,
                    strokeColor: "#1976D2",
                    strokeWeight: 5,
                  },
                }}
              />
            )}

            {locations.map((place:LatLngLiteral) => {
              return(
                <MarkerF
                  key={place.lat}
                  position = {place}
                />
              );
            })}

          </GoogleMap>
        </div>  
    </>
  );
}

export default DriverNavigate;