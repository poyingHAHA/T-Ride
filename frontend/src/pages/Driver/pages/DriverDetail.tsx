import React from "react";
import DriverNavigate from "../components/DriverNavigate";
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { FaUser } from "react-icons/fa6";

const libraries:Libraries = ["marker", "places"];

interface InfoItem {
  id: number;
  name: string;
  start: string;
  end: string;
  time: string; //starting time
  price: number;
  headcount: number;
}
const Card: React.FC<InfoItem> = (props) => {
  return(
    <div className="flex flex-row h-[220px] w-[calc(100%-80px) bg-[#F3E779] p-[20px] rounded-[30px] text-[18px] justify-between">
      <div>
        <p className="text-[24px]">{props.name}</p>
        <span className=" whitespace-pre">人數        ：</span>
        <span>{props.headcount}</span><br />
        <span className="whitespace-pre">金額        ：</span>
        <span>{props.price}</span><br />
        <span className=" whitespace-pre">起點        ：</span>
        <span>{props.start}</span><br />
        <span className=" whitespace-pre">終點        ：</span>
        <span>{props.end}</span><br />
        <span className=" whitespace-pre">出發時間：</span>
        <span>{props.time}</span>
      </div>
      <div className="flex flex-col mr-0 gap-[15px] justify-center">
        <div className="w-[75px] h-[75px] bg-white rounded-full flex justify-center items-center">
          <FaUser className="w-[40px] h-[40px]"/>
        </div>
        <p>查看資訊</p>
      </div>
    </div>
  );
}

const DriverDetail = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });

  const info: InfoItem[] = [
    { id: 1, name: "Bart", start: "竹仁國小", end: "台積一廠", time: "07:35", price: 200, headcount: 2},
    { id: 2, name: "Homer", start: "7-11 竹科門市", end: "台積三廠", time: "08:00", price: 100, headcount: 1}
  ]

  const navigate = useNavigate();

  return (
    <div className="h-full w-screen">
      <div className="h-[calc(100vh-386px)]">
        <div className="h-full overflow-hidden">
          <DriverNavigate isLoaded={isLoaded}/>
        </div>
      </div>
      <div className="bg-white w-full h-[260px] rounded-t-[30px] bottom-[156px] absolute z-1 overflow-auto">
        <div className="flex flex-col p-[30px] gap-[30px]">
          {info.map((passenger:InfoItem) => {
            return(<Card key={passenger.id} {...passenger}/>);
          })}
        </div>
      </div>
      <div className="bg-white w-full h-[70px] absolute bottom-[86px] z-2 flex justify-center items-center">
        <button 
          className="w-[calc(100%-30px)] h-[50px] bg-[#2E5A88] rounded-[10px] text-white text-[24px]"
          onClick={() => {
            navigate('/driver/trip')
          }}
          >返回</button>
      </div>
    </div>
  );
}

export default DriverDetail;