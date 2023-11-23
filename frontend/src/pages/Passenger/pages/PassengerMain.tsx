import React from 'react'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Form, useNavigate } from "react-router-dom";
import { useLoadScript } from '@react-google-maps/api';
import Places from '../components/PassengerPlace';
import {
    GoogleMap,
    Marker,
    DirectionsRenderer
} from '@react-google-maps/api';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Home() {

    const navigate = useNavigate();
    const [start, setStart] = useState<LatLngLiteral>()
    const [end, setEnd] = useState<LatLngLiteral>()
    const [userCenter, setUserCenter] = useState<LatLngLiteral>({ lat: 25.0476133, lng: 121.5174062 })
    const [directions, setDirections] = useState<DirectionsResult>()

    const mapRef = useRef<GoogleMap>();
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserCenter({ lat: latitude, lng: longitude });
        });
    }, [])
    const options = useMemo<MapOptions>(() => ({
        mapId: "d7d7b1b4a6aea68" || "",
        disableDefaultUI: true,
        clickableIcons: false,
    }), [])

    const onLoad = useCallback((map: any) => (mapRef.current = map), [])
    // const houses = useMemo<LatLngLiteral[]>(() => generateHouses(userCenter), [userCenter])

    const fetchDirections = (start: LatLngLiteral, end: LatLngLiteral) => {
        if (!start || !end) return;
        const service = new google.maps.DirectionsService();
        service.route(
            {
                origin: start,
                destination: end,
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

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || '',
        libraries: ['places']
    })

    // if (!isLoaded) return <div>Loading...</div>;

    return <>{isLoaded && (

        <main className="bg-gray-300 flex flex-col items-center h-screen">

            <div className="flex-2 w-full h-full">
                <GoogleMap
                    zoom={15}
                    center={userCenter}
                    mapContainerClassName='w-full h-full'
                    options={options}
                    onLoad={onLoad}
                >
                    {directions && <DirectionsRenderer
                        directions={directions}
                        options={{
                            polylineOptions: {
                                strokeColor: "#1976D2",
                                strokeOpacity: 0.8,
                                strokeWeight: 4,
                            }
                        }} />}
                    <Marker position={userCenter} />
                </GoogleMap>

            </div>
            <div className="flex-1 bg-white flex w-full h-screen flex-col px-10 pb-20 pt-10">

                <Form method="post" className='flex' >
                    <input
                        type="datetime-local"
                        className="flex-1 block w-full h-[50px] p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-150 hover:border-gray-400 placeholder-gray-400 mr-3"
                        placeholder="Select a time" required
                    />

                    <input type="number"
                        className="flex-1 block w-full h-[50px] p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-150 hover:border-gray-400 placeholder-gray-400 ml-3"
                        placeholder="How many pax?"
                        defaultValue={1} required />
                </Form>

                <Places
                    setStart={(position) => {
                        setStart(position)
                        mapRef.current?.panTo(position)
                        if (end) { // 檢查是否已經有終點
                            fetchDirections(end, position);
                        }
                    }}
                    setEnd={(position) => {
                        setEnd(position)
                        mapRef.current?.panTo(position)
                        if (start) { // 檢查是否已經有起點
                            fetchDirections(start, position);
                        }
                    }}
                />

                {/* <input type="text" id="location-input"
                    className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6"
                    placeholder="Pickup location" required />

                <input type="text" id="location-input"
                    className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6"
                    placeholder="Where to?" required /> */}


                <button
                    className="text-white text-xl bg-black p-3 items-center mt-6 rounded-xl mb-5"
                    type="button"
                    onClick={() => {
                        navigate("/passenger/Tripinfo", { state: { start, end } });
                    }}

                >Confirm</button>
            </div>

        </main>

    )}
    </>
}
