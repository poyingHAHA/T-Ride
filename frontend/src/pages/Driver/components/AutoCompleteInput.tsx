import React, {useEffect, useRef} from 'react';
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useAppSelector, useAppDispatch } from "../../../hooks";

type LatLngLiteral = google.maps.LatLngLiteral;
type actionType = {
  name?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
}
type actionCreator = {
  type: string;
  setLocation: (action: actionType) => any;
  setPoint?: (point: LatLngLiteral) => any;
  placeholderText?: string;
};


export default function AutoCompleteInput({ type, setLocation, setPoint, placeholderText }: actionCreator) {
  // 取得使用者目前位置
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const inputElement = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  let initValue: actionType | null;
  
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
  // 抓看看有沒有之前設定好的資料
  useEffect(() => {
    if (type === 'driverStart' && driverStartDestReducer.start.name) {
      setValue(driverStartDestReducer.start.name, false);
    }
    else if (type === 'driverDest' && driverStartDestReducer.dest.name) {
      setValue(driverStartDestReducer.dest.name, false);
    }
    else {
      initValue = {name: '', placeId: '', lat: 0, lng: 0};
    }
  },[driverStartDestReducer])

  const handleSelect = async (val: string) => {
    // false means we don't want to fetch more data
    if(val === 'current' && locationReducer.lat && locationReducer.lng){
      setValue('目前位置', false);
      clearSuggestions();
      if(setPoint) setPoint({lat: locationReducer.lat, lng: locationReducer.lng});
      dispatch(setLocation({name: val, placeId: '', lat: locationReducer.lat, lng: locationReducer.lng}));
      console.log("current")
      return;
    }
    setValue(val, false);
    clearSuggestions();
    const name = val;
    const result = await getGeocode({address: val});
    const placeId = result[0].place_id;
    const {lat, lng} = await getLatLng(result[0]);
    console.log({lat, lng})

    if(setPoint) setPoint({lat, lng});
    dispatch(setLocation({name, placeId, lat, lng}));
  };
  
  return <>
    <div>
        <div className='w-[100%] h-[100%]' >
          <input
            placeholder={placeholderText || "Search an address"}
            ref={inputElement}
            value={value}
            type="text"
            className='text-black w-full bg-gray-50 border border-gray-300 p-2 rounded-md '
            onChange={(e) => {
              console.log(e.target.value)
              setValue(e.target.value);
            }}
          />
          {
            status === 'OK' && 
            <div className='max-h-[90vh] z-50 overflow-scroll w-[100%] bg-[white] text-black flex flex-col rounded-xl shadow-lg shadow-cyan-500/50'>
              {
                type === 'driverStart' && data.length > 0 && (
                  <div className='px-2 py-2 hover:bg-[#ec7c7c]' onClick={() => {handleSelect('current')}} >
                    目前位置
                  </div>
                )
              }
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