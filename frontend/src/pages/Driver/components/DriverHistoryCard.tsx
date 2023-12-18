import React from "react";
import { useNavigate } from 'react-router-dom';
import { driverOrderDTO } from "../../../DTO/orders";
import { convertDate, convertUTC } from "../../../services/formatService";

const HistoryCard: React.FC<driverOrderDTO> = (props) => {
  const navigate = useNavigate(); 

  return (
    <div className="w-[calc(100vw-80px)]" onClick={() =>{
      navigate("/driver/record", {state: {orderId: props.orderId, date: convertDate(props.departureTime)}})
    }}>
      <p className="w-full text-center">{convertDate(props.departureTime)}</p><br/>
      <div className="bg-[#d9d9d9] flex flex-row p-[20px] gap-[20px] rounded-[10px] w-full">
        <div className="flex flex-col gap-[10px]">
          <p>• 起點：{props.startName}</p>
          <p>• 終點：{props.endName}</p>
        </div>
        <div>
          <p>{convertUTC(props.departureTime)}</p>
        </div>
        
      </div>
    </div>
  );
}

export default HistoryCard;