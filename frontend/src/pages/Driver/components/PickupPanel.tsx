import { orderDTO } from "../../../DTO/orders";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useState, useRef, useEffect } from "react";
import PickupCard from "./PickupCard";
import { getDriverUnfinishedOrder, getAcceptedOrders, getInvitationTotal, deleteDriverOrder } from "../../../services/driveOrderService";
import ErrorLoading from "../../../components/ErrorLoading";
import { useNavigate } from "react-router-dom";
import { setTempOrder } from "../../../slices/tempOrder";
import { setWaypoint } from "../../../slices/waypoint";

type LatLngLiteral = google.maps.LatLngLiteral;
type PickupPanelProps = {
  isLoaded: boolean;
  setPanel: (panel: number) => any;
  orders?: orderDTO[];
  markerOrderId: number | null;
  setShowSpots?: (showSpots: boolean) => void;
};

const PickupPanel = ({ isLoaded, setPanel, orders, markerOrderId, setShowSpots }: PickupPanelProps) => {
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  // tempOrderReducer.orders: 紀錄使用者點擊確認後的訂單
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (cardContainerRef.current) {
      document.getElementById(`pickupCard-${markerOrderId}`)?.scrollIntoView({ behavior: "smooth"});
    }
  }, [markerOrderId])

  const backBtnHandler = async() => {
    try{
      setLoading(true);
      if(driverStartDestReducer.order.orderId === null || driverStartDestReducer.order.orderId === undefined){
        setPanel(0);
        setShowSpots && setShowSpots(false);
        setLoading(false);
        return;
      }
      else{
        const acceptedOrders = await getAcceptedOrders(driverStartDestReducer.order.orderId);
        if(acceptedOrders.length > 0){
          setPanel(1);
          alert("請完成已經配對好的訂單");
          setLoading(false);
          return;
        }
      }
      const totalInvitation = await getInvitationTotal(driverStartDestReducer.order.orderId);
      if (totalInvitation !== undefined && totalInvitation.length > 0) {
        alert("請先取消送出的邀請訂單");
        setLoading(false);
        navigate("/driver/info");
      }
      else{
        const res = await deleteDriverOrder(driverStartDestReducer.order.orderId);
        if(res.status === 200){
          dispatch(setTempOrder([]))
          dispatch(setWaypoint([]))
          alert(`取消成功`);
        }
        else{
          alert("取消失敗");
        }
        setPanel(0);
        setShowSpots && setShowSpots(false);
      }
    }catch(err){
      setError("發生錯誤");
      setPanel(1);
      setLoading(false);
    }
  }

  return <>
    {
      isLoaded && (
        <>
          <div className='flex flex-col items-center h-fit min-h-[40vh] bg-white rounded-t-3xl overflow-hidden z-50 '>
            <div className='flex items-center justify-evenly bg-white w-[100vw] mt-0'>
              <div className="mt-2">
                <p>
                  乘客人數 <span className='ml-1'>
                    {
                      tempOrderReducer.orders.reduce((accumulator, currentValue) => accumulator+currentValue.passengerCount, 0)
                    }
                  </span> / <span>{driverDepart.passengerCount}</span> 人
                </p>
              </div>
              <div className="mt-2" >
                <p>
                  總金額<span className='ml-1'>
                    {
                      tempOrderReducer.orders.reduce((accumulator, currentValue)=> accumulator+ currentValue.fee, 0)
                    }
                    </span>元
                </p>
              </div>
            </div>

            <div 
              ref={cardContainerRef}
              className="flex flex-col h-[36vh] w-[100%] overflow-auto"
            >
              {
                orders && orders.map((order) => (
                  <PickupCard key={order.orderId} order={order} markerOrderId={markerOrderId} />
                ))
              }
            </div>

            <div className='fixed bottom-20 flex justify-center w-[100%]'>
              <button 
                className='rounded bg-black w-[40vw] h-10 text-white text-xl mr-4' 
                onClick={backBtnHandler}
              >
                取消
              </button>

              <button 
                className='rounded bg-black w-[40vw] h-10 text-white text-xl'
                onClick={() => {
                  setPanel(2);
                  setShowSpots && setShowSpots(false);
                }}
              >
                確認
              </button>
            </div>
          </div>
          <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} /> 
        </>
      )
    }
  </>;
}

export default PickupPanel;