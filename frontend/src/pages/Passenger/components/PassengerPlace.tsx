import React, { useState } from 'react';
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useAppSelector, useAppDispatch } from "../../../hooks";


type PlacesProps = {
  setStart: (position: google.maps.LatLngLiteral) => void;
  setEnd: (position: google.maps.LatLngLiteral) => void;
};


export default function Places({ setStart, setEnd }: PlacesProps) {
  const [current, setCurrent] = useState<google.maps.LatLngLiteral>({ lat: 25.0476133, lng: 121.5174062 });
  navigator.geolocation.getCurrentPosition((position) => {
    setCurrent({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    })
  }, (error) => {
    console.log(error);
  });
  // ready is a boolean that tells us if the library is ready to use
  // value is the value of the user input
  // setValue is a function that allows us to set the value of the user input
  // suggestions is an object that contains the status and the data of the suggestions
  // status is a string that tells us the status of the request
  // data is an array of suggestions
  // clearSuggestions is a function that allows us to clear the suggestions
  // const [startValue, setStartValue] = useState("");
  // const [endValue, setEndValue] = useState("");
  const { ready: startReady, value: startvalue, setValue: setStartValue, suggestions: { status: startStatus, data: startData }, clearSuggestions: clearStartSuggestions } = usePlacesAutoComplete({
    requestOptions: {
      locationBias: {
        center: { lat: current.lat, lng: current.lng },
        // center: {lat: 25.0476133, lng: 121.5174062},
        radius: 20 * 1000,
      },
      language: 'zh-TW',
      region: 'tw',
    }
  });

  const { ready: endReady, value: endvalue, setValue: setEndValue, suggestions: { status: endStatus, data: endData }, clearSuggestions: clearEndSuggestions } = usePlacesAutoComplete({
    requestOptions: {
      locationBias: {
        center: { lat: current.lat, lng: current.lng },
        // center: {lat: 25.0476133, lng: 121.5174062},
        radius: 20 * 1000,
      },
      language: 'zh-TW',
      region: 'tw',
    }
  });

  // console.log({status, data});
  const handleSelectStart = async (val: string) => {
    // false means we don't want to fetch more data
    setStartValue(val, false);
    clearStartSuggestions();

    const result = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(result[0]);

    setStart({ lat, lng });
  };

  const handleSelectEnd = async (val: string) => {
    // false means we don't want to fetch more data
    setEndValue(val, false);
    clearEndSuggestions();

    const result = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(result[0]);

    setEnd({ lat, lng });
  };

  return <div>
    <div>
      <input
        value={startvalue}
        className="block w-full h-[50px] p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-300 mt-6"
        placeholder="Pickup location"
        onChange={(e) => {
          setStartValue(e.target.value);
        }}
      />
      {
        startStatus === 'OK' &&
        <div className='w-[100%] bg-[white] text-black flex flex-col rounded-xl mt-4 shadow-lg'>
          {startData.map(({ place_id, description }) => (
            <div className='px-2 py-4 hover:bg-[#efefef]' key={place_id} onClick={() => { handleSelectStart(description) }} >
              {description}
            </div>
          ))}
        </div>
      }
      <input
        value={endvalue}
        className="block w-full h-[50px] p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-300 mt-6"
        placeholder="Where to?"
        onChange={(e) => {
          setEndValue(e.target.value);
        }}
      />
      {
        endStatus === 'OK' &&
        <div className='w-[100%] bg-[white] text-black flex flex-col rounded-xl mt-4 shadow-lg '>
          {endData.map(({ place_id, description }) => (
            <div className='px-2 py-4 hover:bg-[#efefef]' key={place_id} onClick={() => { handleSelectEnd(description) }} >
              {description}
            </div>
          ))}
        </div>
      }
    </div>
  </div>
}