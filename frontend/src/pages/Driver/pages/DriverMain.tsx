import DriverMap from '../components/DriverMap';
import AutoCompleteInput from '../components/AutoCompleteInput';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useAppSelector } from "../../../hooks";
import { useEffect, useState } from 'react';

const libraries:Libraries = ["marker", "places"];

const DriverMain = () => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const [start, setStart] = useState<google.maps.LatLngLiteral>();
  const [destination, setDestination] = useState<google.maps.LatLngLiteral>();
  
  // useJsApiLoader hook to load the Google Maps API
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
            <AutoCompleteInput setLocation={setStart} isLoaded={isLoaded} />
          </div>

          <div className='flex justify-around items-center w-[80vw]'>
            <label htmlFor="destination" className='grow' >終點</label>
            <AutoCompleteInput setLocation={setDestination} isLoaded={isLoaded} />
          </div>

          <button className='rounded bg-cyan-800 w-[80vw] h-10  text-white text-xl'>
            確認
          </button>
        </div>
      </>
    )
  }
  </>
}

export default DriverMain