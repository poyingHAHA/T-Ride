import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";

interface PlaceProps {
  type: string;
  location: string; 
  time: string;
}
const Place: React.FC<PlaceProps> = (props) => {
  return(
    <div className="bg-[#d9d9d9] flex flex-row justify-between p-[20px] rounded-[10px] w-[calc(100vw-80px)]">
      <div className="flex flex-col">
        <span className="justify-center text-[18px] font-sans">{props.type}</span>
        <span className="justify-center text-[18px] font-sans">{props.location}</span>
      </div>
      <span className="text-[32px] font-sans">{props.time}</span>
    </div>
  );
}

const DriverTrip: React.FC =() => {
  const navigate = useNavigate();

  interface InfoItem {
    id: number;
    type: string;
    location: string;
    time: string;
  }

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
      <div className="flex flex-col justify-between items-center rounded-t-[30px] bg-white w-screen max-h-[calc(100vh-370px)] relative top-[170px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {journey.map((place) => {
          return (<Place key={place.id} {...place} />);
        })}
      </div>
      <div className="flex flex-row justify-evenly items-center w-screen h-[100px] fixed bottom-[100px]">
          <div
            className="w-[50px] h-[50px] bg-[#f3e779] rounded-[25px] flex justify-center items-center"
            onClick={() => {
              navigate("/driver")
            }}
          ><IoIosInformationCircleOutline className="w-[40px] h-[40px]"/></div>
          <button
            className="w-[300px] h-[50px] rounded-[10px] bg-[#2e5a88] text-white text-[24px]"
            onClick={() => {
              navigate("/driver")
            }}
          >開始導航</button>
      </div>
    </div>
  );
}

export default DriverTrip;