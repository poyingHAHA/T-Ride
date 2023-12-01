import { orderDTO } from "../../../DTO/orders";
import { useAppDispatch, useAppSelector } from "../../../hooks";
// import PickupCard from "./PickupCard";
import { useState, useEffect } from "react";
// import { addOrder } from "../../../slices/tempOrder";
import { MdFace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

type LatLngLiteral = google.maps.LatLngLiteral;
type PickupPanelProps = {
    isLoaded: boolean;
    setPickupPanel: (pickupPanel: boolean) => any;
    orders?: orderDTO[];
};

const PickupPanel = ({ isLoaded, setPickupPanel, orders }: PickupPanelProps) => {

    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    const passengerDepart = useAppSelector((state) => state.passengerDepartReducer);

    const [tempOrders, setTempOrders] = useState<orderDTO[]>([]);
    const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log("PickupPanel tempOrderReducer: ", tempOrderReducer)
    }, [tempOrderReducer])

    const formatUnixDateTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })} 
                ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    const formatUnixTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    return <>
        {
            isLoaded && (
                <>
                    <div className=" flex h-full w-full flex-col px-5 pt-5 pb-3 overflow-auto overscroll-y-contain">
                        <div> {/* Trip details */}
                            <div className='mb-4 text-center text-xl font-bold'>
                                Trip details
                            </div>
                            {/* Trip Information */}
                            <div className="mx-2 flex">
                                <div className="w-3/4 text-base ml-3 font-bold">
                                    {passengerDepart.departureTime1 ? formatUnixDateTimestamp(passengerDepart.departureTime1) : '未設定時間'}~{passengerDepart.departureTime2 ? formatUnixTimestamp(passengerDepart.departureTime2) : '未設定時間'}
                                </div>
                                <div className="flex-1 text-right text-lg mr-5">
                                    $200
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mx-2 flex-col mb-3">
                                <div className="flex">
                                    <div className='w-1/10 flex flex-col my-5 mr-1'>
                                        <img className='h-3 w-3 brightness-0 ml-0.5' src='https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png' alt="Filled Circle" />
                                        <img className='h-[50px] w-5 pr-1' src='https://img.icons8.com/ios/50/9CA3AF/vertical-line.png' alt="Vertical Line" />
                                        <img className='h-4 brightness-0 w-4' src='https://img.icons8.com/windows/50/000000/square-full.png' alt="Square Full" />
                                    </div>


                                    <div className="w-2/3 flex flex-col">
                                        <div className='flex-1 mx-1 my-1 flex justify-between items-center font-bold'>
                                            {passengerStartDestReducer.start.name || '未指定起點'}
                                        </div>
                                        <div className='flex-1 mx-1 my-1 flex justify-between items-center font-bold'>
                                            {passengerStartDestReducer.dest.name || '未指定終點'}
                                        </div>
                                    </div>

                                    <div className="w-1/3 flex flex-col">
                                        <div className='flex-1 my-1 flex items-center justify-end '>
                                            07:30-07:40
                                        </div>
                                        <div className='flex-1 my-1 flex items-center justify-end '>
                                            08:25-08:35
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invitations */}
                        <div className='flex-1 border-gray border-t-2 border-solid items-center justify-center'>
                            <div className="mb-4">
                                <div className="text-center text-xl font-bold my-4 ">
                                    Invitations
                                </div>

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

                                <div className="h-20 flex justify-center items-center py-2" >
                                    <button
                                        className="text-white text-xl bg-black rounded-lg mx-10 h-[50px] w-full items-center"
                                        type="button"
                                        onClick={() => { setPickupPanel(false) }}
                                    >Cancel</button>
                                </div>

                                <div className="px-3">
                                    <div className="flex">
                                        <div className="flex-1 group">
                                            <div className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-black"
                                            >
                                                <span className="block px-1 pt-1 pb-1">
                                                    <span className="block text-xs text-white pb-2 mx-auto">Home</span>
                                                    <span className="block w-5 mx-auto h-1 group-hover:bg-black rounded-full"></span>
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    </>;
}

export default PickupPanel;