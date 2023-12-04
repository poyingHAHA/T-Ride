import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card1 from "../components/DriverInfoCard1";
import Card2 from "../components/DriverInfoCard2";
import { getStartEnd, getInvitationTotal  } from "../../../services/driveOrderService";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setJourney, setStartEnd } from "../../../slices/driverJourney";


interface InfoItem {
  userId: number;
  userName: string;
  startName: string;
  endName: string;
  pickTime: string;
  arriveTime: string;
  state: boolean
}

interface StartEnd {
  name: string,
  time: string
}

const DriverInfo: React.FC = () => {

  //Todo: 傳入orderId

  const [orderId, setOrderId] = useState(1);
  const [start, setStart] = useState<StartEnd>({name:"",time:""});
  const [end, setEnd] = useState<StartEnd>({name:"",time:""});
  const [info, setInfo] = useState<InfoItem[]>([]);
  const [isLoad, setIsLoad] = useState(false);
  const navigate = useNavigate();  
  const dispatch = useAppDispatch();
  const driverJourneyReducer = useAppSelector((state) => state.driverJourneyReducer);

  useEffect(() => {
    async function fetchDriverOrder() {
      try {
        const result= await getStartEnd(orderId);
        dispatch(setStartEnd(result));
      } catch (error) {
        console.error(error);
      }
      const Start = driverJourneyReducer.StartPoint;
      const End = driverJourneyReducer.EndPoint;
      setStart(Start);
      setEnd(End);
    }
    fetchDriverOrder();
  }, [isLoad]);

  useEffect(() => {
    async function fetchPassenger() {
      try {
        const result = await getInvitationTotal(orderId);
        dispatch(setJourney(result));
        setIsLoad(true);
      } catch (error) {
        console.log(error);
      }
      const temp = driverJourneyReducer.Midpoints;
      setInfo(temp);
    }
    fetchPassenger();
  }, [isLoad]);

  return (
    <div className="bg-[#f3e779] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">2023年11月2日 星期三</div>
      <div className="flex flex-col items-center rounded-t-[30px] rounded-t-[30px] bg-white w-screen h-[calc(100vh-320px)] fixed bottom-[150px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        <Card1 name={start.name} time={start.time} />
        { 
          info.map((place: InfoItem) => {
            return (<Card2 key={place.userId} {...place} />);
        })}
        <Card1 name={end.name} time={end.time} />
      </div>

      <div className="bg-white flex flex-col justify-evenly items-center w-screen h-[100px] bottom-[70px] fixed gap-[10px] pb-[20px]">
        <span className="text-[16px]">已邀請： 0/4 已接受： 0/3</span>
        <div className="flex flex-row w-full justify-evenly">
          <button 
            className="w-[120px] h-[50px] bg-[#f3e779] rounded-[10px] text-[24px]"
            onClick={() => {
              navigate("/driver");
            }}
          >返回</button>
          <button
            className="w-[120px] h-[50px] bg-[#f3e779] rounded-[10px] text-[24px]"
            onClick={() => {
              navigate("/driver/trip", {state: {orderId: orderId}});
            }}
          >繼續</button>
        </div>
      </div>
    </div>
  );
}

export default DriverInfo;