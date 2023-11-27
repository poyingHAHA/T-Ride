import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import DriverStar from "../components/DriverStar";

interface RateProps {
  name: string;
}

const names = [
  {id: 1, name: "Bart"},
  {id: 2, name: "Homer"},
  {id: 3, name: "Kusty"},
  {id: 4, name: "Maggie"},
];

const RateCard: React.FC<RateProps> = (props) => {
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
      <form className="px-[40px] flex flex-col gap-[20px] items-end">
        <input type="text" name="comment" placeholder="請輸入評語"
          className="w-full min-h-[100px] border-[1px] border-black p-[5px] rounded-[10px] text-center" />
        <input type="submit" value="送出" 
          className="w-[80px] h-[50px] bg-[#2E5A88] rounded-[10px] text-white text-[18px]" /> 
      </form>
    </div>
  );
}

const DriverRating: React.FC =() => {
  const navigate = useNavigate();

  return(
    <div className="bg-[#f3e779] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">乘客評分</div>
      <div className="flex flex-col justify-between items-center rounded-t-[30px] bg-white w-screen max-h-[calc(100vh-350px)] relative top-[170px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {names.map((name) => {
          return (
            <RateCard key={name.id} {...name} />
          );
        })}
      </div>
      <div className="flex flex-row justify-evenly items-center w-screen h-[100px] fixed bottom-[86px]">
      <button
            className="w-[150px] h-[50px] rounded-[10px] bg-[#2e5a88] text-white text-[24px]"
            onClick={() => {
              navigate("/driver/trip")
            }}
          >返回</button>
      </div>
    </div>
  );
}

export default DriverRating;
