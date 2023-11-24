import DriverMap from '../components/DriverMap';
import { useEffect, useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setLocation } from '../../../slices/location';
import MainPanel from "../components/MainPanel";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
const libraries:Libraries = ["marker", "places"];

const DriverMain = () => {
  const [directions, setDirections] = useState<DirectionsResult>()
  const [startPoint, setStartPoint] = useState<LatLngLiteral>()
  const [destPoint, setDestPoint] = useState<LatLngLiteral>()
  const [pickupPage, setPickupPage] = useState<boolean>(false)
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const dispatch = useAppDispatch();
  
  // useJsApiLoader hook to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const timestamp = position.timestamp;
      console.log("Index: ", position)
      dispatch(setLocation({ lat: latitude, lng: longitude, timestamp }));
    }, (error) => {
      console.log("Index: ", error)
    })

    if(!driverStartDestReducer.start || !driverStartDestReducer.dest) return;
    fetchDirections();
  }, [startPoint, destPoint, isLoaded])

  const fetchDirections = () => {
    if(!startPoint || ! destPoint) return;
    console.log("fetch direction");
    // eslint-disable-next-line no-undef
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: {lat: startPoint.lat, lng: startPoint.lng},
        destination: {lat: destPoint.lat, lng: destPoint.lng},
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  return <>
  {
    isLoaded && (
      <>
        <div className='grow h-[55vh] scale-110'>
          <div className="bg-gray-200 flex justify-center items-center h-full">
            <DriverMap isLoaded={isLoaded} directions={directions} />
          </div>
        </div>
        
        <MainPanel isLoaded={isLoaded} setStartPoint={setStartPoint} setDestPoint={setDestPoint} />
      </>
    )
  }
  </>
}

export default DriverMain