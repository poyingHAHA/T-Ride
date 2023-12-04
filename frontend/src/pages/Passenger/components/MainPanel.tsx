import AutoCompleteInput from '../components/AutoCompleteInput';
import { setStart, setDest } from "../../../slices/passengerStartDest"
import { setDepartureTime1, setDepartureTime2, setPassengerCount } from '../../../slices/passengerDepart';
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Form } from "react-router-dom";
import { postPassengerOrder } from '../../../services/orderService';
import { getTokenFromCookie } from "../../../utils/cookieUtil";

type LatLngLiteral = google.maps.LatLngLiteral;
type MainPanelProps = {
    isLoaded: boolean;
    setStartPoint: (point: LatLngLiteral) => any;
    setDestPoint: (point: LatLngLiteral) => any;
    setPickupPanel: (pickupPanel: boolean) => any;
};

interface PostPassengerOrderRequest {
    token: string;
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
    departureTime1: number;
    departureTime2: number;
    passengerCount: number;
}

const MainPanel = ({ isLoaded, setStartPoint, setDestPoint, setPickupPanel }: MainPanelProps) => {


    const passengerDepart = useAppSelector((state) => state.passengerDepartReducer);
    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    const dispatch = useAppDispatch();
    const token = getTokenFromCookie();

    const handleSelectPassengerCount = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const passengerCount = parseInt(event.target.value);
        dispatch(setPassengerCount(passengerCount));
        console.log(passengerDepart)
    }
    const handleChangeDepartureTime1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const departureTime = new Date(e.target.value).getTime() / 1000;
        dispatch(setDepartureTime1(departureTime));
        console.log(passengerDepart)
    }

    const handleChangeDepartureTime2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const departureTime = new Date(e.target.value).getTime() / 1000;
        dispatch(setDepartureTime2(departureTime));
        console.log(passengerDepart)
    }

    const postpaxorderHandler = async (params: PostPassengerOrderRequest) => {
        // setLoading(true);
        const postpaxorderResult = await postPassengerOrder(params)
    }
    return <>
        {
            isLoaded && (
                <>
                    <div className="bg-white flex h-full w-full flex-col px-10 pt-5 pb-5">
                        <Form method="post"   >
                            <div className="flex-1 block w-full h-[50px] flex justify-between items-center mr-3">
                                <label htmlFor="departureTime text-xs" className='w-[40px] mr-3'>出發時間</label>
                                <input
                                    type="datetime-local"
                                    id="departureTime"
                                    value={passengerDepart.departureTime1 ? new Date(passengerDepart.departureTime1 * 1000 + 8 * 60 * 60 * 1000).toISOString().slice(0, -8) : ""}
                                    name="departureTime"
                                    className="block w-[120px] h-[50px] p-3 border border-gray-300 rounded-lg bg-gray-50 "
                                    onChange={(e) => handleChangeDepartureTime1(e)}
                                />
                                <label htmlFor="departureTime text-xs">~</label>
                                <input
                                    type="datetime-local"
                                    id="departureTime"
                                    value={passengerDepart.departureTime2 ? new Date(passengerDepart.departureTime2 * 1000 + 8 * 60 * 60 * 1000).toISOString().slice(0, -8) : ""}
                                    name="departureTime"
                                    className="block w-[120px] h-[50px] p-3 border border-gray-300 rounded-lg bg-gray-50 "
                                    onChange={(e) => handleChangeDepartureTime2(e)}
                                />
                            </div>
                            <div className="flex-1 block w-full h-[50px] flex justify-between items-center mt-6">
                                <label htmlFor="passNumber" className='w-[40px]'>人數</label>
                                <select
                                    className="block w-[260px] h-[50px] p-3 border border-gray-300 rounded-lg bg-gray-50 "
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
                                console.log(passengerDepart.departureTime1, passengerDepart.departureTime2, passengerDepart.passengerCount)
                                console.log(passengerStartDestReducer.start, passengerStartDestReducer.dest)

                                const startPoint = passengerStartDestReducer.start
                                const endPoint = passengerStartDestReducer.dest

                                if (startPoint.lat !== undefined && startPoint.lng !== undefined && endPoint.lat !== undefined && endPoint.lng !== undefined && startPoint.name !== undefined
                                    && endPoint.name !== undefined && passengerDepart.departureTime1 !== undefined && passengerDepart.departureTime2 !== undefined && passengerDepart.passengerCount !== undefined) {
                                    setPickupPanel(true)

                                    postpaxorderHandler({
                                        token: token,
                                        startPoint: { lat: startPoint.lat, lng: startPoint.lng },
                                        startName: startPoint.name,
                                        endPoint: { lat: endPoint.lat, lng: endPoint.lng },
                                        endName: endPoint.name,
                                        departureTime1: passengerDepart.departureTime1,
                                        departureTime2: passengerDepart.departureTime2,
                                        passengerCount: passengerDepart.passengerCount
                                    });

                                } else {
                                    alert("請填寫完整資料")
                                    return;
                                }
                            }}

                        >Confirm</button>

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
                </>
            )
        }
    </>;
}

export default MainPanel;