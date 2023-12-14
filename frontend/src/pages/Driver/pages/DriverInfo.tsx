import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card1 from "../components/DriverInfoCard1";
import Card2 from "../components/DriverInfoCard2";
import { getStartEnd, getInvitationTotal, deleteDriverInvitation  } from "../../../services/driveOrderService";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setJourney, setStartEnd } from "../../../slices/driverJourney";
import ErrorLoading from '../../../components/ErrorLoading';
import { getTokenFromCookie } from '../../../utils/cookieUtil';

interface InfoItem {
  orderId: number,
  userId: number;
  userName: string;
  startName: string;
  endName: string;
  pickTime: string;
  arriveTime: string;
  state: boolean,
  date: string
}

interface StartEnd {
  name: string,
  time: string,
  date: string
}

const DriverInfo: React.FC = () => {
  const [orderId, setOrderId] = useState(0);
  const [userId, setUserId] = useState();
  const [start, setStart] = useState<StartEnd>({name:"",time:"",date:""});
  const [end, setEnd] = useState<StartEnd>({name:"",time:"",date:""});
  const [date, setDate] = useState("");
  const [info, setInfo] = useState<InfoItem[]>([]);
  const [isLoad, setIsLoad] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); //ErrorLoading
  const [error, setError] = useState<string>("");
  const [refresh, setRefresh] = useState<number>(0);
  const navigate = useNavigate();  
  const dispatch = useAppDispatch();
  const driverJourneyReducer = useAppSelector((state) => state.driverJourneyReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);

  async function handleDelete(passengerOrderId:number) {
    console.log("handleDelete");
    try {
      const token = getTokenFromCookie();
      const response = await deleteDriverInvitation(
          orderId, //driver
          passengerOrderId,
          token
      );
      setRefresh(prev => prev+1);
      setIsLoad(false);
      console.log("response",response);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    if (!orderId) {
      const id:any = driverStartDestReducer.order.orderId;
      setOrderId(id);
      localStorage.setItem("orderId", JSON.stringify(id));
    }

    async function fetchDriverOrder() {
      try {
        setLoading(true);
        const result:any= await getStartEnd(orderId);
        setLoading(false);
        dispatch(setStartEnd(result[0]));
        setUserId(result[1]);
        console.log("result", result);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError("發生錯誤");
      }
      const Start = driverJourneyReducer.StartPoint;
      const End = driverJourneyReducer.EndPoint;
      setStart(Start);
      setEnd(End);
      setDate(Start.date);
    };

    async function fetchPassenger() {
      try {
        setLoading(true);
        const result = await getInvitationTotal(orderId);
        setLoading(false);
        dispatch(setJourney(result));
        const temp = driverJourneyReducer.Midpoints;
        setInfo(temp);
        setIsLoad(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError("發生錯誤");
      }
    };

    if (orderId){
      fetchDriverOrder();
      fetchPassenger();
    }
    const ws = new WebSocket(`ws://t-ride.azurewebsites.net/match/invitation/accept/${orderId}`);
    ws.onmessage = (event) => {
      console.log("event.data", event.data);  
    }
    console.log("ws", ws);

  }, [isLoad, orderId, refresh]);

  return (
    <div className="bg-[#ededed] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">{date}</div>
      <div className="flex flex-col items-center rounded-t-[30px] rounded-t-[30px] bg-white w-screen h-[calc(100vh-320px)] fixed bottom-[150px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        <Card1 name={start.name} time={start.time} />
        { 
          info?.map((place: InfoItem) => {
            return (<Card2 key={place.orderId} {...place} handleDelete={handleDelete} />);
        })}
        <Card1 name={end.name} time={end.time} />
      </div>

      <div className="bg-white flex flex-col justify-evenly items-center w-screen h-[120px] bottom-[70px] fixed gap-[10px] pb-[10px] pt-[10px]">
        <span className="text-[18px]">已接受邀請： {info?.filter(item => item.state)?.length}/{info?.length}</span>
        <div className="flex flex-row w-full justify-evenly">
          <button 
            className="w-[120px] h-[50px] bg-black rounded-[10px] text-[24px] text-white"
            onClick={() => {
              navigate("/driver");
            }}
          >返回</button>
          <button
            className="w-[120px] h-[50px] bg-black rounded-[10px] text-[24px] text-white"
            onClick={() => {
              navigate("/driver/trip");
            }}
          >開始</button>
        </div>
      </div>
      <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} />
    </div>
  );
}

export default DriverInfo;