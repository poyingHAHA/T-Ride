import React, { useEffect, useState } from "react";
import { getFinishedOrder } from "../../../services/driveOrderService";
import { driverOrderDTO } from "../../../DTO/orders";
import HistoryCard from "../components/DriverHistoryCard";
import ErrorLoading from '../../../components/ErrorLoading';

const DriverHistory = () => {
  const [userId, setUserId] = useState<any>(localStorage.getItem("userId"));
  const [orders, setOrders] = useState<driverOrderDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false); //ErrorLoading
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchFinished() {
      try {
        setLoading(true);
        const result:driverOrderDTO[] = await getFinishedOrder(userId) as driverOrderDTO[];
        setOrders(result);
        setLoading(false);
      } catch (error) {
      console.log(error);
      }
    }
    fetchFinished();
  },[]);

  return(
    <div className="bg-[#ededed] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">歷史訂單</div>
      <div className="flex flex-col items-center rounded-t-[30px] rounded-t-[30px] bg-white w-screen h-[calc(100vh-150px)] fixed bottom-[0px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {orders.map((order: driverOrderDTO) => {
          return(<HistoryCard key={order.orderId} {...order}/>);
        })}
      </div>
      <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} />
    </div>
  );
}

export default DriverHistory;