import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import DriverTripCard from "../components/DriverTripCard";
import { getStartEnd, getInvitationTotal  } from "../../../services/driveOrderService";
import ErrorLoading from '../../../components/ErrorLoading';
import { InfoItem } from "../../../slices/driverJourney";

interface TripItem {
  type: string;
  name: string;
  time: string;
}

const DriverHistoryRecord: React.FC = () => {
  const {state} = useLocation();
  const navigate = useNavigate();
  const {orderId, date} = state;
  const [isLoad, setIsLoad] = useState(false)
  const [trip, setTrip] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false); //ErrorLoading
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchAll(){
      try {
        setLoading(true);
        const middle: InfoItem[] = await getInvitationTotal(orderId) as InfoItem[];
        const result:any= await getStartEnd(orderId);
        setLoading(false);
      const mappedPlaces = middle.flatMap((mid) => [
        {
          type: "中途經過",
          name: mid.startName,
          time: mid.pickTime,
        },
        {
          type: "中途經過",
          name: mid.endName,
          time: mid.arriveTime,
        }
      ]);

      const start = { 
        type: "起點", 
        name: result[0][0].name, 
        time: result[0][0].time, 
      };
      const end = { 
        type: "終點", 
        name: result[0][1].name, 
        time: result[0][1].time, 
      };
      setTrip([start, ...mappedPlaces, end]);
      setIsLoad(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("發生錯誤");
    }
    }
    fetchAll();
  },[isLoad]);

  return(
    <div className="bg-[#ededed] m-0 h-screen w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">{date}</div>
      <div className="flex flex-col items-center rounded-t-[30px] bg-white w-screen h-[calc(100vh-220px)] fixed bottom-[50px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {trip.map((place, index) => {
          return (<DriverTripCard key={index} {...place} />);
        })}
        <button 
          className="w-[150px] h-[60px] bg-black rounded-[10px] flex justify-evenly items-center text-white text-[24px]"
          onClick={() => {
            navigate("/driver/history")
          }}
        >返回</button>
      </div>
      <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} />
    </div>
  );
}

export default DriverHistoryRecord;