import { IoMdPerson } from "react-icons/io";
import { orderDTO } from "../../../DTO/orders";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addTempOrder, removeTempOrder } from "../../../slices/tempOrder";
import { addWaypoint, removeWaypoint } from "../../../slices/waypoint";
import { convertUTC } from "../../../services/formatService";

type PickupCardProps = {
  order: orderDTO;
  markerOrderId: number|null;
};

const PickupCard = ({order, markerOrderId}: PickupCardProps) => {
  const [pickupSelected, setPickupSelected] = useState<boolean>(false);
  // 如果card相關的marker被點擊到就把邊框變綠
  const [markerSelected, setMarkerSelected] = useState<boolean>(false)
  const dispatch = useAppDispatch();
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const driverDepartReducer = useAppSelector((state) => state.driverDepartReducer);
  useEffect(() => {
    console.log("PickupCard 22: ", order)
    if(order.orderId === markerOrderId){
      setMarkerSelected(true);
    }
    else{
      setMarkerSelected(false)
    }
  }, [markerOrderId, order.orderId])
  // 如果tempOrderReducer.orders裡面有這個order，就把它的背景變灰
  useEffect(() => {
    if(tempOrderReducer.orders!==undefined && tempOrderReducer.orders.length > 0){
      const index = tempOrderReducer.orders?.findIndex((tempOrder) => tempOrder.orderId === order.orderId);
      if(index !== -1){
        setPickupSelected(true);
      }
      else{
        setPickupSelected(false);
      }
    }
  }, [tempOrderReducer.orders, order.orderId])

  const onCLickHandler = () => {
    if (!pickupSelected && tempOrderReducer.orders?.length === driverDepartReducer.passengerCount) {
      alert("已達乘客人數上限");
      return;
    }
    if (!pickupSelected) {
      setPickupSelected(true);
      if(tempOrderReducer.orders?.length === 0){
        dispatch(addTempOrder({...order, invitationStatus: {invited: false, accepted: false}}));
        dispatch(addWaypoint({
            location: { lat: order.startPoint.lat, lng: order.startPoint.lng },
            stopover: true,
            startName: order.startName,
            time: order.pickTime1,
            orderId: order.orderId,
            pointType: "pickup",
            invitationStatus: order.invitationStatus
          }))
          dispatch(addWaypoint({
            location: { lat: order.endPoint.lat, lng: order.endPoint.lng },
            stopover: true,
            endName: order.endName,
            time: order.pickTime2,
            orderId: order.orderId,
            pointType: "dropoff",
            invitationStatus: order.invitationStatus
          }))
      }
      // 如果tempOrderReducer.orders裡面沒有這個order，就把它加進去
      else if(tempOrderReducer.orders.length > 0){
        const index = tempOrderReducer.orders?.findIndex((tempOrder) => tempOrder.orderId === order.orderId);
        if(index === -1){
          dispatch(addTempOrder({...order, invitationStatus: {invited: false, accepted: false}}));
          dispatch(addWaypoint({
            location: { lat: order.startPoint.lat, lng: order.startPoint.lng },
            stopover: true,
            startName: order.startName,
            time: order.pickTime1,
            orderId: order.orderId,
            pointType: "pickup",
            invitationStatus: order.invitationStatus
          }))
          dispatch(addWaypoint({
            location: { lat: order.endPoint.lat, lng: order.endPoint.lng },
            stopover: true,
            endName: order.endName,
            time: order.pickTime2,
            orderId: order.orderId,
            pointType: "dropoff",
            invitationStatus: order.invitationStatus
          }))
        }
        else{
          // 如果tempOrderReducer.orders裡面已經有這個order，就把它從tempOrderReducer.orders裡面移除
          dispatch(removeTempOrder(order));
        }
      }
    } 
    else {
      setPickupSelected(false);
      if(tempOrderReducer.orders!==undefined && tempOrderReducer.orders.length > 0){
        const index = tempOrderReducer.orders?.findIndex((tempOrder) => tempOrder.orderId === order.orderId);
        if(index !== -1){
          console.log("PickupCard remove: ", order)
          dispatch(removeTempOrder(order));
          dispatch(removeWaypoint({orderId: order.orderId}))
        }
      }
    }
    console.log("PickupCard tempOrderReducer.orders af: ", tempOrderReducer.orders)
  }

  const wrapperClass = pickupSelected ? 
    `flex border rounded-lg mx-4 my-2 bg-gray-200 ${markerSelected && "border-lime-500 border-4"}` 
    : `flex border rounded-lg mx-4 my-2 ${markerSelected && "border-lime-500 border-4"} `;

  return <>
    <div 
      id={`pickupCard-${order.orderId}`}
      className={wrapperClass}
      onClick={onCLickHandler}
    >
      <div className="grow mx-4 my-2">
        <p>乘客: { order.userName!==undefined ? order.userName : order.userId }</p>
        <div className="flex justify-between">
          <p>人數:</p>
          <p>{order.passengerCount}人</p>
        </div>
        <div className="flex justify-between">
          <p>金額:</p>
          <p>${order.fee}</p>
        </div>
        <div className="flex justify-between">
          <p>起點:</p>
          <p className="truncate w-40">{order.startName}</p>
        </div>
        <div className="flex justify-between">
          <p>終點:</p>
          <p className="truncate w-40">{order.endName}</p>
        </div>
        <div className="flex justify-between">
          <p>出發時間:</p>
          <p>{convertUTC(order.pickTime1)}~{convertUTC(order.pickTime2)}</p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <IoMdPerson scale={10} size={100} />
      </div>
    </div>
  </>
}

export default PickupCard;