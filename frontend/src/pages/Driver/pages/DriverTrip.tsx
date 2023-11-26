import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoStarSharp } from "react-icons/io5";
import DriverTripCard from "../components/DriverTripCard";

interface InfoItem {
  id: number;
  type: string;
  location: string;
  time: string;
}

const DriverTrip: React.FC =() => {
  const navigate = useNavigate();

  const journey: InfoItem[] = [
    { id: 1, type: "起點", location: "竹北國小", time: "07:30" },
    { id: 2, type: "中途停靠", location: "竹仁國小", time: "07:35" },
    { id: 3, type: "中途停靠", location: "7-11 竹科門市", time: "08:00" },
    { id: 4, type: "中途停靠", location: "台積三廠", time: "08:20" },
    { id: 5, type: "終點", location: "台積一廠", time: "08:30" }
  ];

  return (
    <div className="bg-[#f3e779] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">2023年11月2日 星期三</div>
      <div className="flex flex-col justify-between items-center rounded-t-[30px] bg-white w-screen max-h-[calc(100vh-350px)] relative top-[170px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {journey.map((place) => {
          return (<DriverTripCard key={place.id} {...place} />);
        })}
      </div>
      <div className="flex flex-row justify-evenly items-center w-screen h-[100px] fixed bottom-[86px]">
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