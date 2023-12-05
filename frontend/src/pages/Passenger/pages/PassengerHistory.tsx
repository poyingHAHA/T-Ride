import React from 'react'
import { useNavigate } from "react-router-dom";
import { getPassengerUnfinishedOrder } from '../../../services/orderService';
import { useState, useEffect } from 'react';
import { setStart, setDest } from "../../../slices/driverStartDest"
import { setDepartureTime, setPassengerCount } from '../../../slices/driverDepart';

interface Order {
    orderId: number;
    startName: string;
    endName: string;
    fee: number;
    arrivalTime: number;
    // 在這裡添加其他需要的屬性
}

export default function PassengerHistory() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [orders, setOrders] = useState<Order[]>([]);

    const navigate = useNavigate();

    const formatUnixDateTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    useEffect(() => {
        const getUnfinishedOrder = async () => {
            try {
                setLoading(true);
                const unfinishedOrder = await getPassengerUnfinishedOrder();
                setLoading(false);
                if (unfinishedOrder.data.length > 0) {
                    setOrders(unfinishedOrder.data);
                }
            } catch (err) {
                setLoading(false);
                setError("發生錯誤");
            }
        }
        getUnfinishedOrder();
    }, [])


    return (
        <div>
            <div className="bg-white overflow-auto overscroll-y-contain ">
                <div className="p-4 items-center justify-center flex">
                    <h2 className="text-lg font-bold">Upcoming Trips</h2>
                </div>

                <div className="space-y-4 px-4">
                    {orders.length > 0 ? (
                        <ul>
                            {orders.map(order => (
                                <button className=' w-full'
                                    type="button"
                                    onClick={() => {
                                        navigate("/passenger/Tripinfo")
                                    }}>
                                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-7">

                                        <div className="px-4 py-2 bg-gray-100">
                                            <p className="text-gray-600 text-sm">{formatUnixDateTimestamp(order.arrivalTime)} </p>
                                        </div>
                                        <div className="p-4 flex">
                                            <div className='flex-1 overflow-hidden mr-2'>
                                                <div className="flex items-center ">
                                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                                    <div className="text-sm font-semibold text-gray-800 truncate">{order.startName}</div>
                                                </div>
                                                <div className="border-l-2 border-dotted border-green-500 my-2 mx-4"></div>
                                                <div className="flex items-center">
                                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                                    <div className="text-sm font-semibold text-gray-800 truncate">{order.endName}</div>
                                                </div>
                                            </div>
                                            <div className="flex-col items-center">
                                                <p className="flex-1">${order.fee}</p>
                                                <p className="flex-1">order:{order.orderId}</p>
                                            </div>
                                        </div>
                                    </div>

                                </button>
                            ))}
                        </ul>
                    ) : (<p></p>)}
                </div>

                <div className="p-4 items-center justify-center flex">
                    <h2 className="text-lg font-bold">Past Orders</h2>
                </div>

                <div className="space-y-4 p-4">
                    <button className=' w-full'
                        type="button"
                        onClick={() => {
                            navigate("/passenger/Tripinfo")
                        }}>
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-7">

                            <div className="px-4 py-2 bg-gray-100">
                                <p className="text-gray-600 text-sm">2023/12/1</p>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center">
                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                    <div className="text-sm font-semibold text-gray-800">新竹市東區新莊車站</div>
                                </div>
                                <div className="border-l-2 border-dotted border-green-500 my-2 mx-4"></div>
                                <div className="flex items-center">
                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                    <div className="text-sm font-semibold text-gray-800 truncate">新竹市東區中央路巨城</div>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-gray-100 flex justify-between items-center">
                                <p className="">$200</p>
                                <div className="text-yellow-400 text-xs">
                                    ★★★★★
                                </div>
                            </div>
                        </div>


                    </button>
                </div>

                <div className="px-3">
                    <div className="flex">
                        <div className="flex-1 group">
                            <div className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-black">
                                <span className="block px-1 pt-1 pb-1">
                                    <span className="block text-xs text-white pb-2 mx-auto">Home</span>
                                    <span className="block w-5 mx-auto h-1 rounded-full"></span>
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}
