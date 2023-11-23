import React, {useEffect, useState} from 'react';
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useAppSelector, useAppDispatch } from "../../../hooks";

type actionType = {
  name?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
}

type actionCreator = {
  type: string;
  setLocation: (action: actionType) => any;
};


export default function AutoCompleteInput({ type, setLocation }: actionCreator) {
  // 取得使用者目前位置
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const dispatch = useAppDispatch();
  let initValue: actionType | null;
  // 抓看看有沒有之前設定好的資料
  if (type === 'driverStart' && driverStartDestReducer.start) {
    initValue = driverStartDestReducer.start;
  }
  else if (type === 'driverDest' && driverStartDestReducer.dest) {
    initValue = driverStartDestReducer.dest;
  }
  else {
    initValue = {name: '', placeId: '', lat: 0, lng: 0};
  }

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

  const handleSelect = async (val: string) => {
    // false means we don't want to fetch more data
    setValue(val, false);
    clearSuggestions();
    const name = val;
    const result = await getGeocode({address: val});
    const placeId = result[0].place_id;
    const {lat, lng} = await getLatLng(result[0]);

    dispatch(setLocation({name, placeId, lat, lng}));
  };
  
  return <>
    <div>
        <div className='relative w-[100%] p-2' >
          <input
            placeholder="Search an address"
            value={value || initValue.name}
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
    </div>
  </>
}