import React from "react";
import DriverNavigate from "../components/DriverNavigate";
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import DriverDetailCard from "../components/DriverDetail";

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

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="h-full w-screen">
      <div className="h-[calc(100vh-386px)]">
        <div className="h-full overflow-hidden">
          <DriverNavigate />
        </div>
      </div>
      <div className="bg-white w-full h-[260px] rounded-t-[30px] bottom-[70px] absolute z-1 overflow-auto">
        <div className="flex flex-col p-[30px] gap-[30px]">
          {info.map((passenger:InfoItem) => {
            return(<DriverDetailCard key={passenger.id} {...passenger}/>);
          })}
        </div>
      </div>
      <div className="bg-white w-full h-[70px] absolute bottom-[0px] z-2 flex justify-center items-center">
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