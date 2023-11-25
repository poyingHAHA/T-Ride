import { IoMdPerson } from "react-icons/io";
import { orderDTO } from "../../../DTO/orders";

type PickupCardProps = {
  order: orderDTO;
};

const PickupCard = ({order}: PickupCardProps) => {
  return <>
    <div className="flex border rounded-lg mx-4 my-2">
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