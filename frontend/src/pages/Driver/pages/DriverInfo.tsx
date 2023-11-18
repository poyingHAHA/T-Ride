import React from "react";
import { useNavigate } from 'react-router-dom';
import Popup from '../components/DriverPopup';


const Card1: React.FC<{
  start: string;
  time: string;
}> = (props) => {
  return (
    <div className="bg-[#d9d9d9] rounded-[10px] p-[20px] w-[calc(100vw-80px)] text-[18px] font-sans">
      {props.start}   {props.time}
    </div>
  );
}

const Card2: React.FC<{
  name: string;
  start: string;
  end: string;
  time: string;
}> = (props) => {
  return (
    <div className="bg-[#d9d9d9] flex flex-col p-[20px] gap-[15px] rounded-[10px] w-[calc(100vw-80px)]">
      <div className="flex flex-row justify-between items-center">
        <div className="text-[24px] font-sans">{props.name}</div>
        <div className="flex flex-row gap-[30px]">
          <Popup text={"送出"} tag={true} />
          <Popup text={"取消"} tag={false} />
        </div>
      </div>
      <div className="flex flex-col gap-[5px]">
        <div>
          <span className="text-[18px] whitespace-pre">起點        ：</span>
          <span className="text-[18px] font-bold">{props.start}</span>
        </div>
        <div>
          <span className="text-[18px] whitespace-pre">終點        ：</span>
          <span className="text-[18px] font-bold">{props.end}<br /></span>
        </div>
        <div>
          <span className="text-[18px] whitespace-pre">出發時間：</span>
          <span className="text-[18px]">{props.time}</span>
        </div>
      </div>
    </div>
  );
}

const DriverInfo: React.FC = () => {
  interface InfoItem {
    id: number;
    name: string;
    start: string;
    end: string;
    time: string;
    state?: string; // Optional
  }

  const info: InfoItem[] = [
    { id: 1, name: "", start: "竹北國小", end: "", time: "07:30" },
    { id: 2, name: "Bart", start: "竹仁國小", end: "台積一廠", time: "07:35", state: "unsent" },
    { id: 3, name: "Homer", start: "7-11 竹科門市", end: "台積三廠", time: "08:00", state: "unsent" },
    { id: 4, name: "", start: "台積一廠", end: "", time: "08:30" },
  ];
  const navigate = useNavigate();

  return (
    <div className="bg-[#f3e779] m-0 h-full w-screen">
      
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">2023年11月2日 星期三</div>
      <div className="flex flex-col justify-between items-center rounded-t-[30px] rounded-l-[30px] bg-white w-screen max-h-[calc(100vh-370px)] relative top-[170px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {info.map((place: InfoItem) => {
          if (place.name===""){
            return (<Card1 key={place.id} {...place}/>);
          }
          else {
            return (<Card2 key={place.id} {...place} />);
          }
        })}
      </div>

      <div className="flex flex-row justify-evenly items-center w-screen h-[100px] bottom-0 mb-[100px] fixed">
        <button 
          className="w-[120px] h-[50px] bg-[#f3e779] rounded-[10px] text-[24px]"
          onClick={() => {
            navigate("/")
          }}
          >返回</button>
        <span className="text-[16px]">已邀請： 0/4 已接受： 0/3</span>
      </div>
    </div>
  );
}

export default DriverInfo;