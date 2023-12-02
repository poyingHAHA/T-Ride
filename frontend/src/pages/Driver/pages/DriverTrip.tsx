import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoStarSharp } from "react-icons/io5";
import DriverTripCard from "../components/DriverTripCard";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { getStartEnd, getInvitationTotal  } from "../../../services/driveOrderService";
import { StartEnd, InfoItem, setStartEnd, setJourney } from "../../../slices/driverJourney";


interface TripItem {
  type: string;
  name: string;
  time: string;
}

const DriverTrip: React.FC =() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const driverJourneyReducer = useAppSelector((state) => state.driverJourneyReducer);
  const [orderId, setOrderId] = useState(1);
  const [trip, setTrip] = useState<TripItem[]>([]);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        const middle: InfoItem[] = await getInvitationTotal(orderId) as InfoItem[];
        dispatch(setJourney(middle));
        const mappedPlaces = driverJourneyReducer.Midpoints.flatMap((mid) => [
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
        const StartEnd: StartEnd[] = await getStartEnd(orderId) as StartEnd[];
        dispatch(setStartEnd(StartEnd));
        const start = { type: "起點", name: driverJourneyReducer.StartPoint.name, time: driverJourneyReducer.StartPoint.time };
        const end = { type: "終點", name: driverJourneyReducer.EndPoint.name, time: driverJourneyReducer.EndPoint.time };

        setTrip([start, ...mappedPlaces, end]);
        setIsLoad(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAll();
  }, [isLoad]);

  return (
    <div className="bg-[#f3e779] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">2023年11月2日 星期三</div>
      <div className="flex flex-col justify-between items-center rounded-t-[30px] bg-white w-screen h-[calc(100vh-350px)] relative top-[170px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {trip.map((place, index) => {
          return (<DriverTripCard key={index} {...place} />);
        })}
      </div>
      <div className="bg-white flex flex-row justify-evenly items-center w-screen h-[100px] fixed bottom-[86px]">
          <div
            className="w-[50px] h-[50px] bg-[#f3e779] rounded-[25px] flex justify-center items-center"
            onClick={() => {
              navigate("/driver/detail")
            }}
          ><IoIosInformationCircleOutline className="w-[40px] h-[40px]"/></div>
          <button
            className="w-[150px] h-[50px] rounded-[10px] bg-[#2e5a88] text-white text-[24px]"
            onClick={() => {
              navigate("/driver/navigate")
            }}
          >開始導航</button>
          <div 
            className="w-[50px] h-[50px] rounded-[10px] bg-[#f3e779] flex justify-center items-center rounded-[25px]"
            onClick={() => {
              navigate("/driver/rating")
            }}
            ><IoStarSharp className="w-[30px] h-[30px]"/></div>
      </div>
    </div>
  );
}

export default DriverTrip;