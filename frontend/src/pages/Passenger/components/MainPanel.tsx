import AutoCompleteInput from '../components/AutoCompleteInput';
import { setStart, setDest } from "../../../slices/passengerStartDest"
import { setDepartureTime, setPassengerCount } from '../../../slices/passengerDepart';
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Form } from "react-router-dom";

type LatLngLiteral = google.maps.LatLngLiteral;
type MainPanelProps = {
    isLoaded: boolean;
    setStartPoint: (point: LatLngLiteral) => any;
    setDestPoint: (point: LatLngLiteral) => any;
    setPickupPanel: (pickupPanel: boolean) => any;
    setShowSpots: (showSpots: boolean) => any;
};

const MainPanel = ({ isLoaded, setStartPoint, setDestPoint, setPickupPanel, setShowSpots }: MainPanelProps) => {


    const passengerDepart = useAppSelector((state) => state.passengerDepartReducer);
    const passengerStartDestReducer = useAppSelector((state) => state.passengerStartDestReducer);
    const dispatch = useAppDispatch();

    const handleSelectPassengerCount = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const passengerCount = parseInt(event.target.value);
        dispatch(setPassengerCount(passengerCount));
        console.log(passengerDepart)
    }
    const handleChangeDepartureTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const departureTime = new Date(e.target.value).getTime() / 1000;
        dispatch(setDepartureTime(departureTime));
        console.log(passengerDepart)
    }

    return <>
        {
            isLoaded && (
                <>
                    <div className="bg-white flex h-full w-full flex-col px-10 pt-10 pb-5">
                        <Form method="post"  >
                            <div className="flex-1 block w-full h-[50px] flex justify-between items-center mr-3">
                                <label htmlFor="departureTime text-xs">出發</label>
                                <input
                                    type="datetime-local"
                                    id="departureTime"
                                    value={passengerDepart.departureTime ? new Date(passengerDepart.departureTime * 1000 + 8 * 60 * 60 * 1000).toISOString().slice(0, -8) : ""}
                                    name="departureTime"
                                    className="block w-[250px] h-[50px] p-3 border border-gray-300 rounded-lg bg-gray-50 "
                                    onChange={(e) => handleChangeDepartureTime(e)}
                                />
                            </div>
                            <div className="flex-1 block w-full h-[50px] flex justify-between items-center mt-6">
                                <label htmlFor="passNumber">人數</label>
                                <select
                                    className="block w-[250px] h-[50px] p-3 border border-gray-300 rounded-lg bg-gray-50 "
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
                                setPickupPanel(true)
                                setShowSpots(true)
                            }}

                        >Confirm</button>
                    </div>
                </>
            )
        }
    </>;
}

export default MainPanel;