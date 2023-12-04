import PassengerMap from '../components/PassengerMap';
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setStart, setDest, resetStart, resetDest } from "../../../slices/passengerStartDest"
import { setLocation } from '../../../slices/location';
import MainPanel from "../components/MainPanel";
import PickupPanel from '../components/PickupPanel';
import { orderDTO } from '../../../DTO/orders';


const libraries: Libraries = ["marker", "places"];
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;

const PassengerMain = () => {
    const navigate = useNavigate();
    // const [directions, setDirections] = useState<DirectionsResult>()
    const [directions, setDirections] = useState<DirectionsResult | undefined>(undefined);
    const [direction_time, setDirection_time] = useState<number>(0)
    const [startPoint, setStartPoint] = useState<LatLngLiteral>()
    const [destPoint, setDestPoint] = useState<LatLngLiteral>()
    const [pickupPanel, setPickupPanel] = useState<boolean>(false)

    // 紀錄使用者點選marker後，該地標附近的訂單
    const [orders, setOrders] = useState<orderDTO[]>([])
    // // Redux state selectors
    const passengerDepart = useAppSelector((state) => state.passengerDepartReducer);
    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    // Dispatch hook from Redux
    const dispatch = useAppDispatch();

    // useJsApiLoader hook to load the Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
        version: "beta",
        libraries,
    });

    useEffect(() => {
        // Reset start and destination when the component mounts
        dispatch(resetStart());
        dispatch(resetDest());
    }, [dispatch]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const timestamp = position.timestamp;
            console.log("Index: ", position)

            dispatch(setLocation({ lat: latitude, lng: longitude, timestamp }));
        }, (error) => {
            console.log("Index: ", error)
        })

        if (!passengerStartDestReducer.start || !passengerStartDestReducer.dest) return;
        fetchDirections();
    }, [startPoint, destPoint, isLoaded])


    const fetchDirections = () => {
        if (!startPoint || !destPoint) return;
        setDirections(undefined);

        const service = new google.maps.DirectionsService();
        service.route(
            {
                origin: { lat: startPoint.lat, lng: startPoint.lng },
                destination: { lat: destPoint.lat, lng: destPoint.lng },
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


    return <>{isLoaded && (

        <main className="flex flex-col items-center h-screen">

            <div className="h-2/3 w-full h-full">
                <PassengerMap isLoaded={isLoaded} directions={directions} />
            </div>
            <div className="w-full h-full overflow-auto overscroll-y-contain ">
                {
                    pickupPanel
                        ? <PickupPanel isLoaded={isLoaded} setPickupPanel={setPickupPanel} orders={orders} directions_time={direction_time} />
                        : <MainPanel isLoaded={isLoaded} setStartPoint={setStartPoint} setDestPoint={setDestPoint} setPickupPanel={setPickupPanel} />
                }
            </div>
        </main>
    )}
    </>
}

export default PassengerMain