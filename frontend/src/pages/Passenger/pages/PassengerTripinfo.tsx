import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import { MdFace } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../../hooks";
// import PassengerMap from '../components/PassengerMap';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { IoMdArrowRoundBack } from "react-icons/io";

const libraries: Libraries = ["marker", "places"];
type DirectionsResult = google.maps.DirectionsResult;

export default function PassengerTripinfo() {

    const navigate = useNavigate();
    // const [directions, setDirections] = useState<DirectionsResult>()
    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    const passengerDepart = useAppSelector((state) => state.passengerDepartReducer);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
        version: "beta",
        libraries,
    });

    const formatUnixTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })} 
                ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

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
                    {/* <PassengerMap isLoaded={isLoaded} directions={directions} /> */}
                    <iframe className="w-full h-60"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12080.73732861526!2d-74.0059418!3d40.7127847!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMDA2JzEwLjAiTiA3NMKwMjUnMzcuNyJX!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus"
                        title="Google Maps Location View"
                    >
                    </iframe>
                </div>

                {/* Trip Information */}
                <div className="mb-4 mx-2 flex">
                    <div className="flex-1 text-base ml-3">
                        2023/11/2 6:45am
                        {/* {passengerDepart.departureTime ? formatUnixTimestamp(passengerDepart.departureTime) : '未設定時間'} */}
                    </div>
                    <div className="flex-1 text-right text-lg font-bold mr-5">
                        $200
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
                                {/* {passengerStartDestReducer.start.name || '未指定起點'} */}
                                新竹縣竹北市高鐵七路6號竹北高鐵站
                            </div>
                        </div>
                        <div className='flex-1 mx-1 my-1 flex justify-between items-center'>
                            <div className="font-bold">
                                {/* {passengerStartDestReducer.dest.name || '未指定終點'} */}
                                新竹市力行六路8號張忠謀大樓
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className='flex-1 ml-1 mr-5 my-1 flex items-center justify-end'>
                            <div className="font-bold">
                                07:30
                            </div>

                        </div>
                        <div className='flex-1 ml-1 mr-5 my-1 flex items-center justify-end'>
                            <div className="font-bold">
                                08:25
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
                            <div className="m-4 pb-2 flex justify-between items-end h-full rounded-lg mx-10">
                                <div className='flex-1'>
                                    <h3 className="font-bold h-[30px]">出發點：新莊車站</h3>
                                    <h3 className="font-bold h-[30px]">目的地：張忠謀大樓</h3>
                                    <p className="text-gray-500 text-lg h-[30px]">行程時間：07:35 - 08:30</p>
                                </div>
                                <span className="block px-1">
                                    <MdFace className="far fa-cog text-5xl block mx-auto" />
                                    <span className="block text-base mx-auto">Burns</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}