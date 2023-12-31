import AutoCompleteInput from '../components/AutoCompleteInput';
import { setStart, setDest, setOrderId } from "../../../slices/driverStartDest"
import { setDepartureTime, setPassengerCount } from '../../../slices/driverDepart';
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { postDriverOrder, getDriverUnfinishedOrder, getInvitationTotal } from '../../../services/driveOrderService';
import { getTokenFromCookie } from '../../../utils/cookieUtil';
import { useState, useEffect } from 'react';
import ErrorLoading from '../../../components/ErrorLoading';
import { orderDTO } from '../../../DTO/orders';
import { addTempOrder } from '../../../slices/tempOrder';
import { addWaypoint, setWaypoint } from '../../../slices/waypoint';

type LatLngLiteral = google.maps.LatLngLiteral;
type MainPanelProps = {
  isLoaded: boolean;
  unfinishedOrderMain: orderDTO[];
  setStartPoint: (point: LatLngLiteral) => any;
  setDestPoint: (point: LatLngLiteral) => any;
  setPanel: (panel: number) => any;
  setShowSpots: (showSpots: boolean) => any;
};

const MainPanel = ({ isLoaded, unfinishedOrderMain, setStartPoint, setDestPoint, setPanel, setShowSpots }: MainPanelProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [unfinishedOrder, setUnfinishedOrder] = useState<orderDTO[]>(unfinishedOrderMain);
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const dispatch = useAppDispatch();

  const handleSelectPassengerCount = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const passengerCount = parseInt(event.target.value);
    dispatch(setPassengerCount(passengerCount));
    console.log(driverDepart)
  }

  const handleChangeDepartureTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const departureTime = new Date(e.target.value).getTime() / 1000;
    console.log("MainPanel 37: ", departureTime)
    // dispatch(setDepartureTime("1703202938"));
    dispatch(setDepartureTime(departureTime));
    console.log(driverDepart)
  }

  const handlePostDriverOrder = async () => {
    const token = getTokenFromCookie();
    if (token === undefined) {
      alert("請先登入");
      return;
    }
    if(unfinishedOrder.length > 0){
      setPanel(1);
      return; 
    }
    if (
      driverStartDestReducer.start.lat === undefined || 
      driverStartDestReducer.start.lng === undefined || 
      driverStartDestReducer.dest.lat === undefined || 
      driverStartDestReducer.dest.lng === undefined || 
      driverDepart.departureTime === undefined ||
      driverStartDestReducer.start.name === undefined ||
      driverStartDestReducer.dest.name === undefined || 
      driverDepart.passengerCount === 0) 
    {
      alert("請填寫完整資料")
      return;
    }
    else{
      const order = {
        token: token,
        startPoint: {
          lat: driverStartDestReducer.start.lat,
          lng: driverStartDestReducer.start.lng,
        },
        startName: driverStartDestReducer.start.name,
        endPoint: {
          lat: driverStartDestReducer.dest.lat,
          lng: driverStartDestReducer.dest.lng,
        },
        endName: driverStartDestReducer.dest.name,
        departureTime: driverDepart.departureTime,
        passengerCount: driverDepart.passengerCount,
      }
      console.log("MainPanel 140", order);
      setLoading(true);
      try{
        const res = await postDriverOrder(order);
        setLoading(false);
        dispatch(setOrderId({orderId: res.data.orderId}));
        setPanel(1)
        setShowSpots(true)
        console.log(res);
      } catch (err) {
        setError("訂單未發送成功");
        setLoading(false);
      }
    }
  }

  return <>
    {
      isLoaded && (
        <>
          <div className='flex flex-col justify-around items-center h-fit min-h-[40vh] bg-white rounded-t-3xl z-50'>
            <div className='flex justify-between items-center w-[80%] mt-4'>
              <div className='flex flex-col items-start justify-start ml-0'>
                <label htmlFor="departureTime" className='text-sm'>出發時間</label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  value={driverDepart.departureTime ? new Date(driverDepart.departureTime * 1000 + 8 * 60 * 60 * 1000).toISOString().slice(0, -8) : ""}
                  name="departureTime"
                  className='bg-gray-200 rounded h-12 w-[90%] p-1'
                  onChange={(e) => handleChangeDepartureTime(e)}
                />
              </div>
              <div className='flex flex-col items-start w-[30%] '>
                <label htmlFor="passNumber" className='text-sm'>人數</label>
                <select name="passNumber" id="passNumber" className='h-12 rounded w-[100%] text-center' onChange={handleSelectPassengerCount} >
                  {
                    [...Array(10)].map((_, i) =>
                      driverDepart.passengerCount === i + 1 ? <option value={i + 1} selected>{i + 1}</option> : <option value={i + 1}>{i + 1}</option>
                    )
                  }
                </select>
              </div>
            </div>

            <div className='w-[80%]'>
              <AutoCompleteInput type='driverStart' setLocation={setStart} setPoint={setStartPoint} placeholderText='請輸入起點' />
            </div>

            <div className='w-[80%]'>
              <AutoCompleteInput type='driverDest' setLocation={setDest} setPoint={setDestPoint} placeholderText='請輸入終點' />
            </div>

            <button
              className='rounded tracking-wide bg-black w-[80vw] h-10  text-white text-xl'
              // disabled={driverStartDestReducer.start === undefined || driverStartDestReducer.dest===undefined || driverDepart.departureTime===undefined || driverDepart.passengerCount===0}
              onClick={handlePostDriverOrder}
            >
              選擇乘客
            </button>
          </div>
        </>
      )
    }
    <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} />
  </>;
}

export default MainPanel;