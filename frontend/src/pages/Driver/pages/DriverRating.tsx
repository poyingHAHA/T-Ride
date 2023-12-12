import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import DriverStar from "../components/DriverStar";
import { useAppSelector } from "../../../hooks";

interface RateProps {
  name: string;
}

const RateCard: React.FC<RateProps> = (props) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //prevent refreshing the page
  };

  return (
    <div className="w-full h-[400px] flex flex-col justify-evenly gap-[20px] my-[10px]">
      <div className="flex flex-start px-[40px] items-center gap-[20px]">
        <div className="w-[80px] h-[80px] bg-[#D9D9D9] rounded-[40px] flex justify-center items-center">
          <FaUser className="w-[40px] h-[40px]"/>
        </div>
        <span className="text-[24px]">{props.name}</span>
      </div>
      <div className="px-[40px]">
        <DriverStar />
      </div>
      <form className="px-[40px] flex flex-col gap-[20px] items-end" onSubmit={handleSubmit}>
        <input type="text" name="comment" placeholder="請輸入評語"
          className="w-full min-h-[100px] border-[1px] border-black p-[5px] rounded-[10px] text-center" />
        <input type="submit" value="送出" 
          className="w-[80px] h-[50px] bg-black rounded-[10px] text-white text-[18px]" /> 
      </form>
    </div>
  );
}

const DriverRating: React.FC =() => {
  const navigate = useNavigate();
  const driverJourneyReducer = useAppSelector((state) => state.driverJourneyReducer);
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    const userNames: string[] = driverJourneyReducer.Midpoints.map((item) => item.userName);
    setNames(userNames);
  }, []);

  return(
    <div className="bg-[#ededed] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">乘客評分</div>
      <div className="flex flex-col justify-between items-center rounded-t-[30px] bg-white w-screen h-[calc(100vh-320px)] fixed bottom-[150px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {names.map((name, index) => {
          return (
            <RateCard key={index} name={name}/>
          );
        })}
      </div>
      <div className="bg-white flex flex-row justify-evenly items-center w-screen h-[100px] fixed bottom-[70px]">
      <button
            className="w-[calc(100%-30px)] h-[50px] rounded-[10px] bg-black text-white text-[24px]"
            onClick={() => {
              navigate("/driver/trip")
            }}
          >返回</button>
      </div>
    </div>
  );
}

export default DriverRating;
