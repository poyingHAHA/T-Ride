import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useState, useEffect } from "react";
import { MdFace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaCircle, FaSquareFull } from "react-icons/fa6";
import { getDriverInvitations } from "../../../services/invitationService";
import { deletePassengerOrder } from "../../../services/orderService";
import { getTokenFromCookie } from "../../../utils/cookieUtil";
import { acceptDriverInvitations, getPassengerAcceptedInvitations } from "../../../services/invitationService";
import { IoMdArrowRoundBack } from "react-icons/io";

type LatLngLiteral = google.maps.LatLngLiteral;
type PickupPanelProps = {
    isLoaded: boolean;
    setPickupPanel: (pickupPanel: boolean) => any;
    orderId: number;
    directions_time: number;
};

interface Invitation {
    orderId: number; // driver orderId
    userId: number;
    startPoint: {
        lat: number;
        lng: number;
    }
    startName: string;
    endPoint: {
        lat: number;
        lng: number;
    }
    endName: string;
    departureTime: number;
    PassengerCount: number;
}

interface AcceptDriverInvitations {
    token: string,
    driverOrderId: number,
    passengerOrderId: number
}

const PickupPanel = ({ isLoaded, setPickupPanel, orderId, directions_time }: PickupPanelProps) => {

    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    const passengerDepart = useAppSelector((state) => state.passengerDepartReducer);

    const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
    const dispatch = useAppDispatch();
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [num_invitations, setNum_Invitations] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const token = getTokenFromCookie();
    const [selectedInvitation, setSelectedInvitation] = useState<number | null>(null);
    const navigate = useNavigate();

    const acceptDriverInvitationsHandler = async (params: AcceptDriverInvitations) => {
        const acceptDriverInvitationsResult = await acceptDriverInvitations(params);
        console.log("acceptDriverInvitations params: ", params)
    }

    useEffect(() => {
        console.log("PickupPanel tempOrderReducer: ", tempOrderReducer)
    }, [tempOrderReducer])

    const formatUnixDatestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}`;
    };

    const formatUnixTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    const handleInvitationClick = (invitationId: number) => {
        if (selectedInvitation === invitationId) {
            // Deselect if the same invitation is clicked again
            setSelectedInvitation(null);
        } else {
            // Select the clicked invitation
            setSelectedInvitation(invitationId);
        }
    };

    useEffect(() => {
        const getInvitations = async () => {
            try {
                setLoading(true);
                const unfinishedOrder = await getDriverInvitations(orderId);
                console.log(unfinishedOrder.data.driverOrders)
                setLoading(false);
                if (unfinishedOrder.data.driverOrders.length > 0) {
                    setInvitations(unfinishedOrder.data.driverOrders);
                    setNum_Invitations(unfinishedOrder.data.driverOrders.length)
                    console.log("inviting")
                }
                else {
                    console.log("no invitation")
                }
            } catch (err) {
                console.log("false")
                setLoading(false);
                setError("發生錯誤");
            }
        }

        const ws = new WebSocket(`ws://t-ride.azurewebsites.net/match/passenger/invitation/total/${orderId}`);
      ws.onmessage = (event) => {
        console.log(event.data);  
      }
      console.log("ws", ws);
        getInvitations();
        console.log(invitations)
    }, [])

    useEffect(() => {
        const getAcceptedInvitations = async () => {
            try {
                setLoading(true);
                const AcceptedInvitations = await getPassengerAcceptedInvitations(orderId);
                console.log(AcceptedInvitations.data)
                setLoading(false);
                if (AcceptedInvitations.data.length > 0){
                    alert("您有已接受的邀請");
                    navigate("/passenger/Navigating")
                
                }

            } catch (err) {
                setLoading(false);
                setError("發生錯誤");
            }

        }

        getAcceptedInvitations();
    }, [])

    return <>
        {
            isLoaded && (
                <>
                    <div className=" flex h-full w-full flex-col px-5 pt-5 pb-3 min-h-[50vh] z-50 overflow-auto overscroll-y-contain">
                        <div>
                            <div className="mb-4">
                                {/* // backbutton
                                    <button
                                    className="absolute top-0 left-0 m-4 cursor-pointer"
                                    type="button"
                                // onClick={() => { navigate("/passenger/History") }}
                                >
                                    <IoMdArrowRoundBack className="far fa-compass text-2xl pt-1 mb-1 block mx-auto" />
                                </button> */}
                                <div className=' text-center text-xl font-bold'>
                                    Trip details
                                </div>
                            </div>
                            {/* Trip Information */}
                            <div className="mx-2 flex">
                                <div className="w-3/4 text-base ml-3 font-bold">
                                    {passengerDepart.departureTime1 ? formatUnixDatestamp(passengerDepart.departureTime1) : '未設定時間'}
                                </div>
                                <div className="flex-1 text-right text-lg mr-5">
                                    $200
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mx-2 flex-col mb-3">
                                <div className="flex">
                                    <div className='w-1/10 flex flex-col my-5 mr-1'>
                                        <div className="flex-1 flex items-center justify-center">
                                            <FaCircle className='h-3 w-3' />
                                        </div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <img className='h-[50px] w-5 brightness-0 contrast-200' src='https://img.icons8.com/ios/50/9CA3AF/vertical-line.png' alt="Vertical Line" />
                                        </div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <FaSquareFull className='h-3 w-3' />
                                        </div>
                                    </div>


                                    <div className="w-2/3 flex flex-col">
                                        <div className='flex-1 mx-1 my-1 flex justify-between items-center font-bold'>
                                            {passengerStartDestReducer.start.name !== 'current' ? (passengerStartDestReducer.start.name) : '目前位置'}
                                        </div>
                                        <div className='flex-1 mx-1 my-1 flex justify-between items-center font-bold'>
                                            {passengerStartDestReducer.dest.name || '未指定終點'}
                                        </div>
                                    </div>

                                    <div className="w-1/3 flex flex-col">
                                        <div className='flex-1 my-1 flex items-center justify-end '>
                                            {passengerDepart.departureTime1 ? formatUnixTimestamp(passengerDepart.departureTime1) : '未設定時間'}~{passengerDepart.departureTime2 ? formatUnixTimestamp(passengerDepart.departureTime2) : '未設定時間'}
                                        </div>
                                        <div className='flex-1 my-1 flex items-center justify-end '>
                                            {passengerDepart.departureTime1 ? formatUnixTimestamp((passengerDepart.departureTime1 + directions_time)) : '未設定時間'}~{passengerDepart.departureTime2 ? formatUnixTimestamp((passengerDepart.departureTime2 + directions_time)) : '未設定時間'}

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

                                {num_invitations > 0 ? (
                                    <ul>
                                        {invitations.map((invitation, index) => (
                                            <div
                                                className={`border-gray border-b rounded-lg border-solid ${selectedInvitation === invitation.orderId ? 'bg-gray-200' : ''}`}
                                                key={index}
                                                onClick={() => handleInvitationClick(invitation.orderId)}
                                            >
                                                <div className="m-2 py-2 flex justify-between items-end h-full rounded-lg ml-7 mr-5">
                                                    <div className='flex-1 mr-1'>
                                                        <div key={index}>
                                                            <h3 className="font-bold">目的地： {invitation.endName}</h3>
                                                            <h3 className="font-bold">driver OrderID： {invitation.orderId}</h3>
                                                            <h3 className="font-bold">pax OrderID： {orderId}</h3>
                                                        </div>
                                                        <p className="text-gray-500">行程時間：07:35 - 08:30</p>
                                                    </div>
                                                    <span className="block ml-3 flex-col items-center justify-center mb-1">
                                                        <MdFace className="far fa-cog text-5xl block mx-auto" />
                                                        <span className="block text-base mx-auto">Burns</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedInvitation !== null ? (
                                            <div className="flex">
                                                <div className="flex-1 w-full flex items-center justify-center pt-5">
                                                    <button
                                                        className="text-white text-xl bg-black rounded-lg mx-10 h-[50px] w-full items-center"
                                                        type="button"
                                                        onClick={() => setSelectedInvitation(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                                <div className="flex-1 w-full flex items-center justify-center pt-5">
                                                    <button
                                                        className="text-white text-xl bg-black rounded-lg mx-10 h-[50px] w-full items-center"
                                                        type="button"
                                                        onClick={() => {
                                                            acceptDriverInvitationsHandler({
                                                                token: token,
                                                                driverOrderId: selectedInvitation,
                                                                passengerOrderId: orderId
                                                            });
                                                            navigate("/passenger/Navigating")
                                                            // 跳轉到導航頁面
                                                        }}
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>) : (
                                            <>
                                                <div className="flex-1 w-full flex items-center justify-center pt-5">
                                                    <button
                                                        className="text-white text-xl bg-black rounded-lg mx-10 h-[50px] w-full items-center"
                                                        type="button"
                                                        onClick={() => {
                                                            setPickupPanel(false);
                                                            deletePassengerOrder(orderId, token);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </ul>
                                ) : (
                                    <div className="flex-col">
                                        <div className="flex items-center justify-center pb-10">
                                            <div>尚未收到邀請</div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="text-white text-xl bg-black rounded-lg mx-10 h-[50px] w-full items-center"
                                                type="button"
                                                onClick={() => {
                                                    setPickupPanel(false);
                                                    deletePassengerOrder(orderId, token);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>)}




                                {/* <div className="h-20 flex justify-center items-center py-2" >
                                    {selectedInvitation !== null ? (
                                        <></>

                                    ) : (
                                        <></>
                                    )}
                                    <button
                                        className="text-white text-xl bg-black rounded-lg mx-10 h-[50px] w-full items-center"
                                        type="button"
                                        onClick={() => {
                                            setPickupPanel(false);
                                            deletePassengerOrder(orderId, token)
                                        }}
                                    // delete passenger order
                                    >Cancel</button>
                                </div> */}

                                <div className="px-3">
                                    <div className="flex">
                                        <div className="flex-1 group">
                                            <div className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-black"
                                            >
                                                <span className="block px-1 pt-1 pb-1">
                                                    <span className="block text-xs text-white pb-2 mx-auto">Home</span>
                                                    <span className="block w-5 mx-auto h-1 rounded-full"></span>
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