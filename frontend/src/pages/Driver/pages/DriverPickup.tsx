import DriverMap from '../components/DriverMap';
import AutoCompleteInput from '../components/AutoCompleteInput';
import { useEffect, useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useAppSelector } from "../../../hooks";
import { setStart, setDest } from "../../../slices/driverStartDest"
import { useNavigate } from "react-router-dom";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
const libraries:Libraries = ["marker", "places"];

const DriverPickup = () => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });

  return <>
    {
      isLoaded && (
        <>
          <div className='grow h-[55vh] scale-110'>
          <div className="bg-gray-200 flex justify-center items-center h-full">
            <DriverMap isLoaded={isLoaded} />
          </div>
        </div>
        </>
      )
    }
  </>
}

export default DriverPickup;