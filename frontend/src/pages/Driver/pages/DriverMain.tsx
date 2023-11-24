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

const DriverMain = () => {
  const [directions, setDirections] = useState<DirectionsResult>()
  const [startPoint, setStartPoint] = useState<LatLngLiteral>()
  const [destPoint, setDestPoint] = useState<LatLngLiteral>()
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const navigate = useNavigate();
  // useJsApiLoader hook to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });

  useEffect(() => {
    if(!driverStartDestReducer.start || !driverStartDestReducer.dest) return;
    fetchDirections();
  }, [startPoint, destPoint])

  const fetchDirections = () => {
    if(!startPoint || ! destPoint) return;
    console.log("fetch direction");
    // eslint-disable-next-line no-undef
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: {lat: startPoint.lat, lng: startPoint.lng},
        destination: {lat: destPoint.lat, lng: destPoint.lng},
        // eslint-disable-next-line no-undef
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
        
        <div className='flex flex-col justify-around items-center h-[30vh] bg-white rounded-t-3xl overflow-hidden z-10'>
          <div className='flex justify-between items-center w-[80vw] mt-4'>
            <div className='flex grow-[3] justify-start items-center'>
              <label htmlFor="departureTime">出發</label>
              <input type="datetime-local" id="departureTime" name="departureTime" className='bg-gray-200 rounded h-12 w-[12rem] ml-2 p-1' />
            </div>
            <div className='flex grow-0 justify-between items-center'>
              <label htmlFor="passNumber">人數</label>
              <select name="passNumber" id="passNumber" className='h-12 rounded w-10 text-center ml-1'>
                {[...Array(10)].map((_, i) => <option value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
          </div>

          <div className='flex justify-around items-center w-[80vw]'>
            <label htmlFor="start" className='grow' >起點</label>
            <AutoCompleteInput type='driverStart' setLocation={setStart} setPoint={setStartPoint} />
          </div>

          <div className='flex justify-around items-center w-[80vw]'>
            <label htmlFor="destination" className='grow' >終點</label>
            <AutoCompleteInput type='driverDest' setLocation={setDest} setPoint={setDestPoint} />
          </div>

          <button 
            className='rounded bg-cyan-800 w-[80vw] h-10  text-white text-xl'
            onClick={() => navigate('/driver/pickup')}
          >
            選擇乘客
          </button>
        </div>
      </>
    )
  }
  </>
}

export default DriverMain