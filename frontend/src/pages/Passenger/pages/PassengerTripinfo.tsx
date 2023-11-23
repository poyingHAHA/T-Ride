import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { MdFace } from "react-icons/md";

export default function PassengerTripinfo() {

    const navigate = useNavigate();
    const location = useLocation();
    const { start, end } = location.state || {};

    return (
        <div className="flex flex-col w-full h-screen">

            <div className='flex-1 p-4'>
                {/* Header */}
                <div className="text-center text-xl font-bold mb-4">
                    Trip details
                </div>

                {/* Map Image Placeholder */}
                <div className="bg-gray-300 h-40 rounded-lg mb-4">
                    <iframe className="w-full h-40"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12080.73732861526!2d-74.0059418!3d40.7127847!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMDA2JzEwLjAiTiA3NMKwMjUnMzcuNyJX!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus"
                        title="Google Maps Location View"
                    >
                    </iframe>
                </div>

                {/* Trip Information */}
                <div className="mb-4 mx-2 flex">
                    <div className="flex-1 text-base ml-3">
                        2023/11/2 6:45am
                    </div>
                    <div className="flex-1 text-right text-lg font-bold mr-5">
                        $200
                    </div>
                </div>

                {/* Address */}
                <div className="mx-2 flex">
                    <div className='w-4 flex flex-col mx-3 my-5'>
                        <img className='h-3 w-3 brightness-0 ml-0.5' src='https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png' alt="Filled Circle" />
                        <img className='h-[50px] brightness-0' src='https://img.icons8.com/ios/50/9CA3AF/vertical-line.png' alt="Vertical Line" />
                        <img className='h-4 brightness-0' src='https://img.icons8.com/windows/50/000000/square-full.png' alt="Square Full" />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className='flex-1 mx-1 my-1'>
                            <div className="text-base font-bold">
                                竹北高鐵站
                                
                            </div>
                            <div className="text-sm text-gray-600">
                                新竹縣竹北市高鐵七路6號
                            </div>
                        </div>
                        <div className='flex-1 mx-1 my-1'>
                            <div className="text-base font-bold">
                                張忠謀大樓
                            </div>
                            <div className="text-sm text-gray-600">
                                新竹市力行六路8號
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className='flex-1 ml-1 mr-5 my-1 flex items-center justify-end'>
                            <div className="text-base">
                                07:30 - 07:40
                            </div>

                        </div>
                        <div className='flex-1 ml-1 mr-5 my-1 flex items-center justify-end'>
                            <div className="text-base">
                                08:25 - 08:35
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Invitations */}
            <div className='flex-1 border-gray border-t-2 border-solid overflow-auto overscroll-y-contain items-center justify-center'>
                <div className="mb-4">
                    <div className="text-center text-xl font-bold my-4 ">
                        Invitations
                    </div>
                    <div>

                        <div className="h-20 border-gray border-b border-solid " >
                            <div className="m-4 pb-2 flex justify-between items-end h-full rounded-lg mx-10">
                                <div className='flex-1'>
                                    <h3 className="font-bold text-lg">目的地：張忠謀大樓</h3>
                                    <p className="text-gray-500 text-lg">行程時間：07:35 - 08:30</p>
                                </div>
                                <span className="block px-1">
                                    <MdFace className="far fa-cog text-5xl block mx-auto" />
                                    <span className="block text-base mx-auto">Burns</span>
                                </span>
                            </div>
                        </div>

                        <div className="h-20 border-gray border-b border-solid" >
                            <div className="m-4 pb-2 flex justify-between items-end h-full rounded-lg mx-10">
                                <div className='flex-1'>
                                    <h3 className="font-bold text-lg">張忠謀大樓</h3>
                                    <p className="text-gray-500 text-lg">07:35 - 08:30</p>
                                </div>
                                <span className="block px-1">
                                    <MdFace className="far fa-cog text-5xl block mx-auto" />
                                    <span className="block text-base mx-auto">Burns</span>
                                </span>
                            </div>
                        </div>

                        <div className="h-20 border-gray border-b border-solid" >
                            <div className="m-4 pb-2 flex justify-between items-end h-full rounded-lg mx-10">
                                <div className='flex-1'>
                                    <h3 className="font-bold text-lg">張忠謀大樓</h3>
                                    <p className="text-gray-500 text-lg">07:35 - 08:30</p>
                                </div>
                                <span className="block px-1">
                                    <MdFace className="far fa-cog text-5xl block mx-auto" />
                                    <span className="block text-base mx-auto">Burns</span>
                                </span>
                            </div>
                        </div>

                        <div className="h-20 flex justify-center items-center pb-2" >
                            <button
                                className="text-white text-xl bg-black rounded-lg mx-10 h-[50px] w-full items-center"
                                type="button"
                                onClick={() => {
                                    navigate("/passenger")
                                }}

                            >Cancel</button>
                        </div>

                    </div>

                </div>






            </div>


            <div className="flex flex-col flex-4 bg-white rounded-t-[30px] overflow-y-auto">
                <div className="flex flex-3 items-center justify-center">
                    {/* Invitations component */}
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <button className="bg-[#f3e779] text-center align-middle rounded-[10px] py-2.5 px-5 w-[120px] border border-lightgray text-lg cursor-pointer"
                        onClick={() => {
                            navigate("/passenger")
                        }}>
                        取消
                    </button>
                </div>
            </div>
        </div>
    )
}