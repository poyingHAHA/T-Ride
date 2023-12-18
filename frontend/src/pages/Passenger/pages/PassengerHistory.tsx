import React from 'react'
import { useNavigate } from "react-router-dom";
import { getPassengerUnfinishedOrder, getPassengerFinishedOrder } from '../../../services/orderService';
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
    const [finishedorders, setFinishedOrders] = useState<Order[]>([]);

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

    useEffect(() => {
        const getFinishedOrder = async () => {
            try {
                setLoading(true);
                const finishedOrder = await getPassengerFinishedOrder();
                setLoading(false);
                if (finishedOrder.data.length > 0) {
                    setFinishedOrders(finishedOrder.data);
                }
            } catch (err) {
                setLoading(false);
                setError("發生錯誤");
            }
        }
        getFinishedOrder();
    }, [])


    return (
        <div>
            <div className="bg-white overflow-auto overscroll-y-contain">

                {orders.length > 0 ? (
                    <ul>
                        <div className="my-4 p-4 items-center justify-center flex ">
                            <h2 className="text-lg font-bold">Upcoming Trips</h2>
                        </div>

                    </ul>
                ) : (<p></p>)}

                <div className="space-y-4 px-4">
                    {orders.length > 0 ? (
                        <ul>
                            {orders.map(order => (
                                <button className=' w-full'
                                    type="button"
                                    onClick={() => {
                                        navigate("/passenger/Tripinfo", { state: { orderId: order.orderId } })
                                    }}>
                                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden mb-7">
                                        <div className="px-4 py-2 bg-gray-100 mt-2 flex">
                                            <p className="font-bold">{formatUnixDateTimestamp(order.arrivalTime)} </p>
                                        </div>
                                        <div className="p-4 flex">
                                            <div className='flex-1 overflow-hidden mr-2'>
                                                <div className="flex items-center ">
                                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                                    <div className="font-semibold text-gray-800 truncate">{order.startName}</div>
                                                </div>
                                                <div className="border-l-2 border-dotted border-green-500 my-2 mx-4"></div>
                                                <div className="flex items-center">
                                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                                    <div className="font-semibold text-gray-800 truncate">{order.endName}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <p className="flex-1 font-semibold">NT${order.fee}</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </ul>
                    ) : (<p></p>)}
                </div>

                <div className="mt-4 p-4 items-center justify-center flex">
                    <h2 className="my-2 text-lg font-bold">Past Orders</h2>
                </div>

                {finishedorders.length > 0 ? (
                    <ul>
                        {finishedorders.map(finishedorder => (
                            <div className="space-y-4 p-4">
                                <button className=' w-full'
                                    type="button"
                                    onClick={() => {
                                        navigate("/passenger/Tripinfo", { state: { orderId: finishedorder.orderId } })
                                    }}>
                                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden mb-7">
                                        {/* <div className="border-solid border-b-2 overflow-hidden mb-7"> */}
                                        <div className="px-4 py-2 mt-2 flex justify-between">

                                            <p className="font-bold">{formatUnixDateTimestamp(finishedorder.arrivalTime)} </p>
                                            <div className="font-bold">
                                                {/* ★★★★★ */}
                                                Completed
                                            </div>
                                        </div>
                                        <div className="p-4 flex">
                                            <div className='flex-1 overflow-hidden mr-2'>
                                                <div className="flex items-center ">
                                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                                    <div className="font-semibold text-gray-800 truncate">{finishedorder.startName}</div>
                                                </div>
                                                <div className="border-l-2 border-dotted border-green-500 my-2 mx-4"></div>
                                                <div className="flex items-center">
                                                    <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                                                    <div className="font-semibold text-gray-800 truncate">{finishedorder.endName}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <p className="flex-1 font-semibold">NT${finishedorder.fee}</p>

                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <div className='flex items-center justify-center'>
                        <div className=''>無訂單記錄</div>
                    </div>)}

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
