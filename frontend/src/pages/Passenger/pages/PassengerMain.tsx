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
    const [directions, setDirections] = useState<DirectionsResult>()
    const [startPoint, setStartPoint] = useState<LatLngLiteral>()
    const [destPoint, setDestPoint] = useState<LatLngLiteral>()
    const [pickupPanel, setPickupPanel] = useState<boolean>(false)
    const [showSpots, setShowSpots] = useState<boolean>(false)
    const [markerOrderId, setMarkerOrderId] = useState<number | null>(null)
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
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }


    return <>{isLoaded && (

        <main className="flex flex-col items-center h-screen">

            <div className="h-2/5 w-full h-full">
                <PassengerMap isLoaded={isLoaded} directions={directions} />
            </div>
            <div className="h-3/5 w-full h-full overflow-auto overscroll-y-contain ">
                {/* <MainPanel isLoaded={isLoaded} setStartPoint={setStartPoint} setDestPoint={setDestPoint} setPickupPanel={setPickupPanel} setShowSpots={setShowSpots} /> */}

                {
                    pickupPanel
                        ? <PickupPanel isLoaded={isLoaded} setPickupPanel={setPickupPanel} orders={orders} markerOrderId={markerOrderId} setShowSpots={setShowSpots} />
                        : <MainPanel isLoaded={isLoaded} setStartPoint={setStartPoint} setDestPoint={setDestPoint} setPickupPanel={setPickupPanel} setShowSpots={setShowSpots} />
                }
            </div>
            {/* <div className="flex-1 bg-white flex w-full h-screen flex-col px-10 pb-20 pt-10">

                <Form method="post" className='flex' >
                    <div className="flex-1 block w-full h-[50px] flex justify-between items-center mr-3">
                        <label htmlFor="departureTime">出發</label>
                        <input
                            type="datetime-local"
                            id="departureTime"
                            value={passengerDepart.departureTime ? new Date(passengerDepart.departureTime * 1000 + 8 * 60 * 60 * 1000).toISOString().slice(0, -8) : ""}
                            name="departureTime"
                            className=" w-[130px] h-[50px] text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-300"
                            onChange={(e) => handleChangeDepartureTime(e)}
                        />
                    </div>
                    <div className="flex-1 block w-full h-[50px] flex justify-between items-center">
                        <label htmlFor="passNumber">人數</label>
                        <select
                            className=" w-[130px] h-[50px] text-gray-900 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-300"
                            name="passNumber"
                            id="passNumber"
                            onChange={handleSelectPassengerCount}
                        >
                            {
                                [...Array(5)].map((_, i) =>
                                    passengerDepart.passengerCount === i + 1 ? <option value={i + 1} selected>{i + 1}</option> : <option value={i + 1}>{i + 1}</option>
                                )
                            }
                        </select>
                    </div>
                </Form>

                <AutoCompleteInput type='passengerStart'
                    setLocation={setStart}
                    setPoint={setStartPoint}
                    placeholderText="Pickup location"
                />

                <AutoCompleteInput type='passengerDest'
                    setLocation={setDest}
                    setPoint={setDestPoint}
                    placeholderText="Where to?"
                />

                <button
                    className="text-white text-xl bg-black p-3 items-center mt-6 rounded-xl mb-5"
                    type="button"
                    onClick={() => {
                        console.log(passengerDepart.departureTime, passengerDepart.passengerCount)
                        console.log(passengerStartDestReducer.start, passengerStartDestReducer.dest)
                        // if (passengerStartDestReducer.start.name === undefined || passengerStartDestReducer.dest.name === undefined) {
                        //     alert("請填寫完整資料")
                        //     return;
                        // }
                        // navigate("/passenger/Tripinfo", { state: { directions: directions } });
                        navigate("/passenger/Tripinfo")
                    }}

                >Confirm</button>
            </div> */}

        </main>

    )}
    </>
}

export default PassengerMain