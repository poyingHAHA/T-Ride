import React from 'react'
import NavigatingMap from '../components/NavigatingMap';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { postPassengerFinishedOrder } from '../../../services/orderService';
import { getTokenFromCookie } from "../../../utils/cookieUtil";

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
    const [driverlocations, setDriverlocations] = useState<LatLngLiteral | undefined>(undefined);
    const token = getTokenFromCookie();
    const navigate = useNavigate();

    console.log("passengerOrderId", passengerOrderId)
    
    // useJsApiLoader hook to load the Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
        version: "beta",
        libraries,
    });

    useEffect(() => {
        const ws = new WebSocket(`ws://t-ride.azurewebsites.net/match/position/driver/get/${passengerOrderId}`);
        ws.onmessage = (event) => {
            console.log(event.data);
            if (event.data === "true") {
                // setRefresh(!refresh);  
            }
        }
        console.log("ws", ws);
    }, []);

    const postPassengerFinishedOrderHandler = async (params: PassengerFinishedOrder) => {
        const PassengerFinishedOrderResult = await postPassengerFinishedOrder(params);
        console.log("postPassengerFinishedOrder params: ", params)
    }

    return (
        <main className="bg-white flex flex-col items-center h-screen w-full">
    {isLoaded && (
        <div className="relative h-full w-full">
            <NavigatingMap isLoaded={isLoaded} driverlocation={driverlocations} />
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