import React, {useEffect, useState} from 'react';
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useAppSelector } from "../../../hooks";

type PlacesProps = {
  setLocation: (position: google.maps.LatLngLiteral) => void;
  isLoaded: boolean;
};


export default function AutoCompleteInput({ setLocation, isLoaded }: PlacesProps) {
  // 取得使用者目前位置
  const locationReducer = useAppSelector((state) => state.locationReducer);

  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutoComplete({
    requestOptions: {
      locationBias:{
        center: {lat: locationReducer.lat? locationReducer.lat : 25.0174525, lng: locationReducer.lng ? locationReducer.lng : 121.545246},
        radius: 200 * 1000,
      },
      language: 'zh-TW',
      region: 'tw',
    }
  });

  // 測試用
  useEffect(() => {
    console.log("isLoaded: ", isLoaded)
    console.log(data)
  }, [data])
  // ==============================

  const handleSelect = async (val: string) => {
    // false means we don't want to fetch more data
    setValue(val, false);
    clearSuggestions();

    const result = await getGeocode({address: val});
    const {lat, lng} = await getLatLng(result[0]);

    setLocation({lat, lng});
  };
  
  return <>
    <div>
      {isLoaded &&(
        <div className='relative w-[100%] p-2' >
          <input
            placeholder="Search an address"
            value={value}
            type="text"
            className='text-black bg-gray-50 border border-gray-300 p-2 rounded-md w-[80%]'
            onChange={(e) => {
              console.log(e.target.value)
              setValue(e.target.value);
            }}
          />
          {
            status === 'OK' && 
            <div className='absolute max-h-32 z-50 overflow-scroll w-[100%] bg-[white] text-black flex flex-col rounded-xl shadow-lg shadow-cyan-500/50'>
              {data.map(({place_id, description}) => (
                <div className='px-2 py-2 hover:bg-[#ec7c7c]' key={place_id} onClick={() => {handleSelect(description)}} >
                  {description}
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  </>
}