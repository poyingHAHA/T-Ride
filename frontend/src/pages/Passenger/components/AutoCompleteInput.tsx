import React, { useEffect, useState } from 'react';
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
    placeholderText: string;
};


export default function AutoCompleteInput({ type, setLocation, placeholderText }: actionCreator) {
    // 取得使用者目前位置
    const locationReducer = useAppSelector((state) => state.locationReducer);
    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    const dispatch = useAppDispatch();
    let initValue: actionType | null;
    // 抓看看有沒有之前設定好的資料
    if (type === 'passengerStart' && passengerStartDestReducer.start) {
        initValue = passengerStartDestReducer.start;
    }
    else if (type === 'passengerDest' && passengerStartDestReducer.dest) {
        initValue = passengerStartDestReducer.dest;
    }
    else {
        initValue = { name: '', placeId: '', lat: 0, lng: 0 };
    }

    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutoComplete({
        requestOptions: {
            locationBias: {
                center: { lat: locationReducer.lat ? locationReducer.lat : 25.0174525, lng: locationReducer.lng ? locationReducer.lng : 121.545246 },
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
        const result = await getGeocode({ address: val });
        const placeId = result[0].place_id;
        const { lat, lng } = await getLatLng(result[0]);

        dispatch(setLocation({ name, placeId, lat, lng }));
        console.log(name, placeId, lat, lng);
    };

    return <>
        <div>
            <div>
                <input
                    placeholder={placeholderText || "Search an address"} // 使用传入的 placeholderText
                    value={value || initValue.name}
                    type="text"
                    className="block w-full h-[50px] p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-300 mt-6"
                    onChange={(e) => {
                        console.log(e.target.value)
                        setValue(e.target.value);
                    }}
                />
                {
                    status === 'OK' &&
                    <div className='w-[100%] bg-[white] text-black flex flex-col rounded-xl mt-4 shadow-lg'>
                        {data.map(({ place_id, description }) => (
                            <div className='px-2 py-4 hover:bg-[#efefef]' key={place_id} onClick={() => { handleSelect(description) }} >
                                {description}
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    </>
}