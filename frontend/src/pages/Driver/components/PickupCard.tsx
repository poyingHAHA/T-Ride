import { IoMdPerson } from "react-icons/io";
import { orderDTO } from "../../../DTO/orders";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addTempOrder, removeTempOrder } from "../../../slices/tempOrder";

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
    if (tempOrderReducer.orders?.length === driverDepartReducer.passengerCount) {
      alert("已達乘客人數上限");
      return;
    }
    if (!pickupSelected) {
      setPickupSelected(true);
      if(tempOrderReducer.orders?.length === 0){
        dispatch(addTempOrder(order));
      }
      // 如果tempOrderReducer.orders裡面沒有這個order，就把它加進去
      else if(tempOrderReducer.orders.length > 0){
        const index = tempOrderReducer.orders?.findIndex((tempOrder) => tempOrder.orderId === order.orderId);
        if(index === -1){
          dispatch(addTempOrder(order));
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
          dispatch(removeTempOrder(order));
        }
      }
    }
    console.log("PickupCard tempOrderReducer.orders af: ", tempOrderReducer.orders)
  }

  const wrapperClass = pickupSelected ? `flex border rounded-lg mx-4 my-2 bg-gray-200 ${markerSelected && "border-lime-500 border-4"}` : `flex border rounded-lg mx-4 my-2 ${markerSelected && "border-lime-500 border-4"} `;

  return <>
    <div 
      className={wrapperClass}
      onClick={onCLickHandler}
    >
      <div className="grow mx-4 my-2">
        <p>userId: {order.userId}</p>
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
          <p>{order.startName}</p>
        </div>
        <div className="flex justify-between">
          <p>終點:</p>
          <p>{order.endName}</p>
        </div>
        <div className="flex justify-between">
          <p>出發時間:</p>
          <p>{order.pickTime1}~{order.pickTime2}</p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <IoMdPerson scale={10} size={100} />
      </div>
    </div>
  </>
}

export default PickupCard;