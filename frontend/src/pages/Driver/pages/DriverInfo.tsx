import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card1 from "../components/DriverInfoCard1";
import Card2 from "../components/DriverInfoCard2";
import axios from 'axios';

interface InfoItem {
  userId: number;
  userName: string;
  startName: string;
  endName: string;
  pickTime1: string;
  state?: boolean; // Optional
}
interface StartEnd {
  name: string;
  time: string;
}
interface TotalInvitations {
  passengerOrder: {
    orderId: number,
    userId: number,
    startPoint: {},
    startName: string,
    endPoint: {},
    endName: string,
    pickTime1: number,
    pickTime2: number,
    arrivalTime: number,
    passengerCount: number,
    fee: number,
  },
  time: number,
  accepted: boolean
}


const DriverInfo: React.FC = () => {
  const [orderID, setOrderID] = useState(0);
  const [start, setStart] = useState<StartEnd>({name: "竹北國小", time: "0730"});
  const [end, setEnd] = useState<StartEnd>({name: "台積一廠", time: "0830"});
  const [info, setInfo] = useState<InfoItem[]>([
    { userId: 1, userName: "Bart", startName: "竹仁國小", endName: "台積一廠", pickTime1: "0735", state: false },
    { userId: 2, userName: "Homer", startName: "7-11 竹科門市", endName: "台積三廠", pickTime1: "0800", state: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDriverOrder() {
      try {
        const driverOrder = await axios.get(`http://ws1.csie.ntu.edu.tw:5239/order/driver/${orderID}`);
        const response = driverOrder.data;
        setStart({name: response["startName"], time: String(response["departureTime"])});
        setEnd({name: response["endName"], time: String(response["departureTime"])});
      } catch (error) {
        console.error(error);
      }
    }
    fetchDriverOrder();
  }, []);

  useEffect(() => {
    async function getName(userId: number) {
      try {
        const userInfo = await axios.get(`http://ws1.csie.ntu.edu.tw:5239/user/${userId}`);
        const info = userInfo.data;
        return info["username"];
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchPassenger() {
      try {
        const passengerOrder = await axios.get(`http://ws1.csie.ntu.edu.tw:5239/match/driver/invitation/total/${orderID}`);
        const response = passengerOrder.data;
        const passengerInfo = response["orders"].map((item: TotalInvitations) => {
          const userName = getName(item.passengerOrder.userId);
          return {
            userId: item.passengerOrder.userId,
            userName: userName,
            startName: item.passengerOrder.startName,
            endName: item.passengerOrder.endName,
            pickTime1: item.passengerOrder.pickTime1,
            state: item.accepted
          };
        });
        setInfo(passengerInfo);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPassenger();
  }, []);

  return (
    <div className="bg-[#f3e779] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">2023年11月2日 星期三</div>
      <div className="flex flex-col justify-between items-center rounded-t-[30px] rounded-l-[30px] bg-white w-screen max-h-[calc(100vh-350px)] relative top-[170px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        <Card1 name={start.name} time={start.time} />
        { 
          info.map((place: InfoItem) => {
            return (<Card2 key={place.userId} {...place} />);
        })}
        <Card1 name={end.name} time={end.time} />
      </div>

      <div className="flex flex-row justify-evenly items-center w-screen h-[80px] bottom-0 mb-[86px] fixed">
        <button 
          className="w-[120px] h-[50px] bg-[#f3e779] rounded-[10px] text-[24px]"
          onClick={() => {
            navigate("/driver")
          }}
          >返回</button>
        <span className="text-[16px]">已邀請： 0/4 已接受： 0/3</span>
      </div>
    </div>
  );
}

export default DriverInfo;