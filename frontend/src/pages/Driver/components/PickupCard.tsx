import { IoMdPerson } from "react-icons/io";
import { orderDTO } from "../../../DTO/orders";
import { useEffect, useState } from "react";

type PickupCardProps = {
  order: orderDTO;
  tempOrders: orderDTO[];
  setTempOrders: (orders: orderDTO[]) => void;
  markerOrderId: number|null;
};

const PickupCard = ({order, setTempOrders, tempOrders, markerOrderId}: PickupCardProps) => {
  const [pickupSelected, setPickupSelected] = useState<boolean>(false);
  // 如果card相關的marker被點擊到就把邊框變綠
  const [markerSelected, setMarkerSelected] = useState<boolean>(false)
  useEffect(() => {
    if(order.orderId === markerOrderId){
      setMarkerSelected(true);
    }
    else{
      setMarkerSelected(false)
    }
  }, [markerOrderId, order.orderId])

  const onCLickHandler = () => {
    if (!pickupSelected) {
      setPickupSelected(true);
      if(tempOrders?.length === 0){
        setTempOrders && setTempOrders([order]);
        console.log("PickupCard tempOrders bf: ", tempOrders)
      }
      else if(tempOrders!==undefined && tempOrders.length > 0){
        console.log("PickupCard tempOrders bf: ", tempOrders.length)
        const index = tempOrders?.findIndex((tempOrder) => tempOrder.orderId === order.orderId);
        if(index === -1){
          setTempOrders && setTempOrders([...tempOrders, order]);
        }
        else{
          const newTempOrders = tempOrders?.filter((tempOrder) => tempOrder.orderId !== order.orderId);
          setTempOrders && setTempOrders(newTempOrders);
        }
      }
    } 
    else {
      setPickupSelected(false);
      if(tempOrders!==undefined && tempOrders.length > 0){
        const index = tempOrders?.findIndex((tempOrder) => tempOrder.orderId === order.orderId);
        if(index !== -1){
          const newTempOrders = tempOrders?.filter((tempOrder) => tempOrder.orderId !== order.orderId);
          setTempOrders && setTempOrders(newTempOrders);
        }
      }
    }
    console.log("PickupCard tempOrders af: ", tempOrders)
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