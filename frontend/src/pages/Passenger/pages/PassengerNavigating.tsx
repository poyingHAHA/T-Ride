import React from 'react'
import NavigatingMap from '../components/NavigatingMap';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { postPassengerFinishedOrder } from '../../../services/orderService';
import { getTokenFromCookie } from "../../../utils/cookieUtil";
import { useAppSelector } from "../../../hooks";

const libraries: Libraries = ["marker", "places"];
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;

interface PassengerFinishedOrder {
    token: string,
    orderId: number
}


export default function PassengerNavigating() {

    const location = useLocation();
    const { passengerOrderId } = location.state || {};
    const [directions, setDirections] = useState<DirectionsResult | undefined>(undefined);
    const [direction_time, setDirection_time] = useState<number>(0)
    const [driverlocations, setDriverlocations] = useState<LatLngLiteral | undefined>(undefined);
    const locationReducer = useAppSelector((state) => state.locationReducer);
    const [currentCenter, setCurrentCenter] = useState<LatLngLiteral>({ lat: locationReducer.lat || 0, lng: locationReducer.lng || 0 });
    const [refresh, setRefresh] = useState<boolean>(false);

    const token = getTokenFromCookie();
    const navigate = useNavigate();

    console.log("passengerOrderId", passengerOrderId)
    
    // useJsApiLoader hook to load the Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
        version: "beta",
        libraries,
    });

    const fetchDirections = () => {
        if (!driverlocations) return;
        setDirections(undefined);

        const service = new google.maps.DirectionsService();
        service.route(
            {
                origin: { lat: driverlocations.lat, lng: driverlocations.lng },
                destination: { lat: currentCenter.lat, lng: currentCenter.lng },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK' && result) {
                    setDirections(result);
                    if (result.routes[0] &&
                        result.routes[0].legs[0] &&
                        result.routes[0].legs[0].duration &&
                        result.routes[0].legs[0].duration.value !== undefined) {

                        const time = result.routes[0].legs[0].duration.value;
                        setDirection_time(time)
                    }
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }

    useEffect(() => {
        fetchDirections();
    }, [refresh])

    useEffect(() => {
        const ws = new WebSocket(`ws://t-ride.azurewebsites.net/match/position/driver/get/${passengerOrderId}`);
        ws.onopen = () => {
            console.log("ws open");
        }
        ws.onmessage = (event) => {
            
            console.log(event.data);
            const parts = event.data.split(','); // 分割字符串
            const latitude = parseFloat(parts[0].trim()); // 提取并转换纬度
            const longitude = parseFloat(parts[1].trim()); // 提取并转换经度

            // console.log('Latitude:', latitude);
            // console.log('Longitude:', longitude);
            setRefresh(!refresh)
            console.log("refresh", refresh)
            const newLocation: LatLngLiteral = {
                lat: latitude,
                lng: longitude
            };
            setDriverlocations(newLocation);
            
        }
        console.log("ws", ws);
        ws.onerror = (error) => {
            console.log("ws error", error);
        }
        ws.onclose = () => {
            console.log("ws close");
        }
        
    }, [driverlocations, refresh]);

    const postPassengerFinishedOrderHandler = async (params: PassengerFinishedOrder) => {
        const PassengerFinishedOrderResult = await postPassengerFinishedOrder(params);
        console.log("postPassengerFinishedOrder params: ", params)
    }

    return (
        <main className="bg-white flex flex-col items-center h-screen w-full">
    {isLoaded && (
        <div className="relative h-full w-full">
            <NavigatingMap isLoaded={isLoaded} directions={directions} driverlocation={driverlocations} />

            (driverlocations && (
                <div className='absolute top-20 w-full flex items-center justify-center h-[50px] p-3 bg-gray-100 '>
                    <div className="flex text-black text-2xl rounded-lg ">
                        Loading...
                    </div>
                </div>    
            ))

            <div className='absolute bottom-20 w-full flex items-center justify-center p-3'>
                <button
                    className="text-white text-xl bg-black rounded-lg h-[50px] w-1/2"
                    type="button"
                    onClick={ () => {
                            postPassengerFinishedOrderHandler({
                                token: token,
                                orderId: passengerOrderId
                            });
                            navigate("/passenger/History")
                            // 跳轉到紀錄頁面
                    }}
                >
                    Finished
                </button>
            </div>
        </div>
    )}
</main>

    )
}