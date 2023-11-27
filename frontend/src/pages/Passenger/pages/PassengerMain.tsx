import AutoCompleteInput from '../components/AutoCompleteInput';
import PassengerMap from '../components/PassengerMap';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Form, useNavigate } from "react-router-dom";
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useAppSelector } from "../../../hooks";
import { setStart, setDest } from "../../../slices/passengerStartDest"
import { useAppDispatch } from '../../../hooks';

import {
    GoogleMap,
    Marker,
    DirectionsRenderer
} from '@react-google-maps/api';


const libraries: Libraries = ["marker", "places"];

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const PassengerMain = () => {
    const navigate = useNavigate();
    // const [start, setStart] = useState<LatLngLiteral>()
    // const [end, setEnd] = useState<LatLngLiteral>()
    const locationReducer = useAppSelector((state) => state.locationReducer);
    const location = { ...locationReducer }

    // Redux state selectors
    const start = useAppSelector((state) => state.passengerStartDestReducer.start);
    const dest = useAppSelector((state) => state.passengerStartDestReducer.dest);

    // Dispatch hook from Redux
    const dispatch = useAppDispatch();

    const [userCenter, setUserCenter] = useState<LatLngLiteral>({ lat: 25.0476133, lng: 121.5174062 })
    const [directions, setDirections] = useState<DirectionsResult>()

    const mapRef = useRef<GoogleMap>();

    // useEffect(() => {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //         const { latitude, longitude } = position.coords;
    //         setUserCenter({ lat: latitude, lng: longitude });
    //     });
    // }, [])

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

    useEffect(() => {
        if (dest.lat !== undefined && dest.lng !== undefined) {
            // Pan the map to the new destination
            console.log(dest.lat, dest.lng);
            mapRef.current?.panTo({ lat: dest.lat, lng: dest.lng });

            // Check if you also have a start location to fetch directions
            if (start.lat !== undefined && start.lng !== undefined) {
                // fetchDirections(start, dest);
                fetchDirections(
                    { lat: start.lat, lng: start.lng },
                    { lat: dest.lat, lng: dest.lng }
                );
            }
        }
    }, [dest, start, fetchDirections]);

    const options = useMemo<MapOptions>(() => ({
        mapId: "d7d7b1b4a6aea68" || "",
        disableDefaultUI: true,
        clickableIcons: false,
    }), [])

    const defaultProps = {
        center: { lat: location.lat, lng: location.lng },
        zoom: 15
    };

    const onLoad = useCallback((map: any) => (mapRef.current = map), [])


    // useJsApiLoader hook to load the Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
        version: "beta",
        libraries,
    });


    return <>{isLoaded && (

        <main className="bg-gray-300 flex flex-col items-center h-screen">

            <div className="flex-2 w-full h-full">
                {/* <PassengerMap isLoaded={isLoaded} /> */}
                <GoogleMap
                    zoom={defaultProps.zoom}
                    center={{ lat: 25.0476133, lng: 121.5174062 }}
                    mapContainerClassName='w-full h-full'
                    options={options}
                    onLoad={onLoad}
                >

                </GoogleMap>

            </div>
            <div className="flex-1 bg-white flex w-full h-screen flex-col px-10 pb-20 pt-10">

                <Form method="post" className='flex' >
                    <input
                        type="datetime-local"
                        className="flex-1 block w-full h-[50px] p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-300 mr-3"
                        placeholder="Select a time" required
                    />

                    <input type="number"
                        className="flex-1 block w-full h-[50px] p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-300 ml-3"
                        placeholder="How many pax?"
                        required />
                </Form>

                {/* <Places
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
                /> */}

                <AutoCompleteInput type='passengerStart'
                    setLocation={setStart}
                    // setLocation={(position) => {
                    //     if (position.lat !== undefined && position.lng !== undefined) {
                    //         // setStart({ lat: position.lat, lng: position.lng });
                    //         // Call the action creator with the expected payload
                    //         dispatch(setStart({
                    //             name: position.name,
                    //             placeId: position.placeId,
                    //             lat: position.lat,
                    //             lng: position.lng
                    //         }));

                    //         // Assuming mapRef is a ref to the GoogleMap instance
                    //         mapRef.current?.panTo({ lat: position.lat, lng: position.lng });

                    //         // If there's a destination set, fetch directions
                    //         if (dest && dest.lat !== undefined && dest.lng !== undefined) {
                    //             fetchDirections(
                    //                 { lat: position.lat, lng: position.lng },
                    //                 { lat: dest.lat, lng: dest.lng }
                    //             );
                    //         }
                    //     }
                    // }}
                    placeholderText="Pickup location"
                />

                {/* <AutoCompleteInput
                    type='passengerDest'
                    setLocation={(position) => {
                        // Dispatch the setDest action with the new position
                        if (position.lat !== undefined && position.lng !== undefined) {
                            dispatch(setDest({
                                name: position.name,
                                placeId: position.placeId,
                                lat: position.lat,
                                lng: position.lng
                            }));
                        }
                    }}
                    placeholderText="Where to?"
                /> */}

                <AutoCompleteInput type='passengerDist'
                    setLocation={setDest}
                    // setLocation={(position) => {
                    //     if (position.lat !== undefined && position.lng !== undefined) {
                    //         setStart({ lat: position.lat, lng: position.lng });
                    //         mapRef.current?.panTo({ lat: position.lat, lng: position.lng });

                    //         if (end && end.lat !== undefined && end.lng !== undefined) {
                    //             fetchDirections(
                    //                 { lat: end.lat, lng: end.lng },
                    //                 { lat: position.lat, lng: position.lng }
                    //             );
                    //         }
                    //     }
                    // }}
                    placeholderText="Where to?"
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
                        navigate("/passenger/Tripinfo");
                    }}

                >Confirm</button>
            </div>

        </main>

    )}
    </>
}

export default PassengerMain