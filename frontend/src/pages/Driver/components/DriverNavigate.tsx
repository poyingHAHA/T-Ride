import React, { useEffect, useState } from "react";
import { GoogleMap, MarkerF, InfoWindowF, OverlayView, DirectionsRenderer, } from "@react-google-maps/api";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { getStartEnd, getInvitationTotal  } from "../../../services/driveOrderService";
import { StartEnd, InfoItem, setStartEnd, setJourney } from "../../../slices/driverJourney";
import { useLocation } from 'react-router-dom';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapProps = boolean;

const DriverNavigate = (props: any) =>{
  const defaultProps = {
    zoom: 15
  };
  const [directions, setDirections] = useState<DirectionsResult>();
  const [isLoad, setIsLoad] = useState(false);
  const [locations, setLocations] = useState<LatLngLiteral[]>([]);
  const dispatch = useAppDispatch();
  const driverJourneyReducer = useAppSelector((state) => state.driverJourneyReducer);
  const location = useLocation();
  const order = location.state?.orderId;

  useEffect(() => {
    async function fetchSpots(order: number) {
      const middle: InfoItem[] = await getInvitationTotal(order) as InfoItem[];
      dispatch(setJourney(middle));
      const StartEnd: StartEnd[] = await getStartEnd(order) as StartEnd[];
      dispatch(setStartEnd(StartEnd));

      const start: LatLngLiteral= driverJourneyReducer.StartPoint.place;
      const midpoints1: LatLngLiteral[] = driverJourneyReducer.Midpoints.map((item) => item.startPlace);
      const midpoints2: LatLngLiteral[] = driverJourneyReducer.Midpoints.map((item) => item.endPlace);
      const end: LatLngLiteral = driverJourneyReducer.EndPoint.place;
      const allLocations: LatLngLiteral[] = [start, ...midpoints1, ...midpoints2, end];
      setLocations(allLocations);
    };
    fetchSpots(order);
    setIsLoad(true);
  }, [isLoad]);

  useEffect(() => {
    const fetchDirections = (place: LatLngLiteral) => {
      const service = new google.maps.DirectionsService();
      const origin = locations[0];
      const destination = locations[locations.length - 1];
      const waypoints = locations.slice(1, -1).map(loc => {
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
    locations.forEach(place => {
      fetchDirections(place); 
    });
  }, [locations]);

  return (
    <>
        <div className="w-full h-screen">
          <GoogleMap
            center={locations[0]}
            zoom={defaultProps.zoom}
            mapContainerStyle={{ height: "60%", width: "100%" }}
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