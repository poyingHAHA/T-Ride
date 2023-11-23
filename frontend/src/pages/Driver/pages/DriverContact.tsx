import React from "react";
import DriverNavigate from "../components/DriverNavigate";
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { RiArrowGoBackLine } from "react-icons/ri";
import { FaPhoneVolume } from "react-icons/fa6";

const libraries:Libraries = ["marker", "places"];
const DriverContact = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });

  return (
    <div className="h-full w-screen">
      <div className="h-[calc(100vh-156px)]">
        <div className="h-full overflow-hidden">
          <DriverNavigate isLoaded={isLoaded}/>
        </div>
      </div>
      <div className="bg-white w-full h-[100px] absolute z-1 bottom-[86px] flex flex-row justify-evenly items-center rounded-t-[30px]">
        <button className="w-[60px] h-[60px] bg-[#F3E779] rounded-[30px] flex justify-center items-center">
          <RiArrowGoBackLine className="w-[25px] h-[25px]"/>
        </button>
        <span className="text-[24px]">返回</span>
        <button className="w-[60px] h-[60px] bg-[#2E5A88] rounded-[30px] flex justify-center items-center">
          <FaPhoneVolume className="w-[25px] h-[25px] text-white"/>
        </button>
        <span className="text-[24px]">聯絡乘客</span>
      </div>
    </div>
  );
}

export default DriverContact;