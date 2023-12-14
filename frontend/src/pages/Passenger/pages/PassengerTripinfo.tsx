import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import { MdFace } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import PassengerMap from '../components/PassengerMap';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { IoMdArrowRoundBack } from "react-icons/io";
import { getPassengerOrderbyPorderID } from '../../../services/orderService';
import { getPassengerAcceptedInvitations } from '../../../services/invitationService';
import { getDriverinfo } from '../../../services/userService';

const libraries: Libraries = ["marker", "places"];
type DirectionsResult = google.maps.DirectionsResult;
type LatLngLiteral = google.maps.LatLngLiteral;


export default function PassengerTripinfo() {

    const location = useLocation();
    const { orderId } = location.state || {};
    const navigate = useNavigate();
    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    const passengerDepart = useAppSelector((state) => state.passengerDepartReducer);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [startName, setStartName] = useState<string>("");
    const [endName, setEndName] = useState<string>("");
    const [fee, setFee] = useState<number>(0);
    const [departureTime, setDepartureTime] = useState<number>(0);
    const [arrivalTime, setArrivalTime] = useState<number>(0);

    const [directions, setDirections] = useState<DirectionsResult | undefined>(undefined);
    const [direction_time, setDirection_time] = useState<number>(0)
    const [startPoint, setStartPoint] = useState<LatLngLiteral>()
    const [destPoint, setDestPoint] = useState<LatLngLiteral>()

    const [driverstartName, setDriverStartName] = useState<string>("");
    const [driverendName, setDriverEndName] = useState<string>("");
    const [driverdepartureTime, setDriverDepartureTime] = useState<number>(0);
    const [driverarrivalTime, setDriverArrivalTime] = useState<number>(0);
    const [driverId, setDriverId] = useState<number>(-1)
    const [driverName, setDriverName] = useState<string>("")

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
        version: "beta",
        libraries,
    });

    const formatUnixDateTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })} 
                ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    const formatUnixTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return ` ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    const getDriverName = async () => {
        try {
            const Userinfo = await getDriverinfo(driverId);
            setDriverName(Userinfo.data.userName)
        } catch (err) {
            setError("發生錯誤");
        }
    }

    console.log(orderId)

    useEffect(() => {
        const getAcceptedInvitations = async () => {
            try {
                setLoading(true);
                const PassengerOrderbyPorderID = await getPassengerOrderbyPorderID(orderId);
                console.log("PassengerOrderbyPorderID", PassengerOrderbyPorderID.data)
                setStartName(PassengerOrderbyPorderID.data.startName)
                setEndName(PassengerOrderbyPorderID.data.endName)
                setFee(PassengerOrderbyPorderID.data.fee)
                setDepartureTime(PassengerOrderbyPorderID.data.departureTime1)
                setArrivalTime(PassengerOrderbyPorderID.data.arrivalTime)
                setStartPoint(PassengerOrderbyPorderID.data.startPoint)
                setDestPoint(PassengerOrderbyPorderID.data.endPoint)

                setLoading(false);

            } catch (err) {
                setLoading(false);
                setError("發生錯誤");
            }

        }
        getAcceptedInvitations();
    }, [])

    useEffect(() => {
        const getDriverInfo = async () => {
            try {
                const PassengerAcceptedInvitations = await getPassengerAcceptedInvitations(orderId);
                console.log(PassengerAcceptedInvitations.data.driverOrder)
                setDriverStartName(PassengerAcceptedInvitations.data.driverOrder.start_name)
                setDriverEndName(PassengerAcceptedInvitations.data.driverOrder.end_name)
                setDriverDepartureTime(PassengerAcceptedInvitations.data.driverOrder.departure_time)
                setDriverId(PassengerAcceptedInvitations.data.driverOrder.user_id)
            }
            catch (err) {
                setLoading(false);
                setError("發生錯誤");
            }
        }
        getDriverInfo();
        getDriverName();
        // console.log(driverId)
    }, [driverId])

    useEffect(() => {
        fetchDirections()
    }, [startPoint, destPoint])

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
                    console.log('OK')
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

    return (
        <div className="flex flex-col w-full h-screen">

            <div className='h-5/6 p-4'>
                {/* Header */}
                <div className='mb-4'>
                    <button
                        className="absolute top-0 left-0 m-4 cursor-pointer"
                        type="button"
                        onClick={() => { navigate("/passenger/History") }}>
                        <IoMdArrowRoundBack className="far fa-compass text-2xl pt-1 mb-1 block mx-auto" />
                    </button>
                    <div className="text-center text-xl font-bold">

                        Trip details
                    </div>
                </div>
                {/* Map Image Placeholder */}
                <div className="bg-gray-300 h-60 rounded-lg mb-4">
                    <PassengerMap isLoaded={isLoaded} directions={directions} detail={false} />
                    {/* <iframe className="w-full h-60"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12080.73732861526!2d-74.0059418!3d40.7127847!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMDA2JzEwLjAiTiA3NMKwMjUnMzcuNyJX!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus"
                        title="Google Maps Location View"
                    >
                    </iframe> */}
                </div>

                {/* Trip Information */}
                <div className="mb-4 mx-2 flex">
                    <div className="flex-1 text-base ml-3 font-bold">
                        {formatUnixDateTimestamp(departureTime)}
                    </div>
                    <div className="flex-1 text-right text-lg font-bold mr-5">
                        ${fee}
                    </div>
                </div>

                {/* Address */}
                <div className="mx-2 flex">
                    <div className='w-4 flex flex-col mx-3 mb-5 mt-6'>
                        <img className='h-3 w-3 brightness-0 ml-0.5' src='https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png' alt="Filled Circle" />
                        <img className='h-[50px] brightness-0' src='https://img.icons8.com/ios/50/9CA3AF/vertical-line.png' alt="Vertical Line" />
                        <img className='h-4 brightness-0' src='https://img.icons8.com/windows/50/000000/square-full.png' alt="Square Full" />
                    </div>

                    <div className="w-2/3 flex flex-col">
                        <div className='flex-1 mx-1 my-1 flex justify-between items-center'>
                            <div className="font-bold">
                                {startName}
                            </div>
                        </div>
                        <div className='flex-1 mx-1 my-1 flex justify-between items-center'>
                            <div className="font-bold">
                                {endName}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className='flex-1 ml-1 mr-5 my-1 flex items-center justify-end'>
                            <div className="font-bold">
                                {formatUnixTimestamp(departureTime)}
                            </div>

                        </div>
                        <div className='flex-1 ml-1 mr-5 my-1 flex items-center justify-end'>
                            <div className="font-bold">
                                {formatUnixTimestamp(arrivalTime)}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Driver's Info */}
            <div className='h-2/5 border-gray border-t-2 border-solid items-center justify-center'>
                <div className="mb-4">
                    <div className="text-center text-xl font-bold my-4 ">
                        Driver's Info
                    </div>
                    <div>
                        <div>
                            <div className="m-4 pb-2 flex items-center justify-center justify-between items-end h-full rounded-lg mx-10">
                                <div className='flex-1 flex-col items-center justify-center '>
                                    <h3 className="font-bold h-[30px]">出發點：{driverstartName}</h3>
                                    <h3 className="font-bold h-[30px]">目的地：{driverendName}</h3>
                                    {/* <p className="text-gray-500 h-[30px]">行程時間：{formatUnixDateTimestamp(driverdepartureTime)}</p> */}
                                </div>
                                <span className="flex-col items-center justify-center block px-1">
                                    <MdFace className="far fa-cog text-5xl block mx-auto" />
                                    <span className="block text-base font-bold mx-auto">{driverName}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}