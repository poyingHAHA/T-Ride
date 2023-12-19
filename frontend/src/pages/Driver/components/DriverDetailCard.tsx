import { useEffect, useState } from "react";
import DriverContact from "./DriverContact";
import PersonalPage from "./PersonalPage";
import { getPerson } from "../../../services/driveOrderService";
import { userDTO } from "../../../DTO/user";

interface InfoItem {
  id: number;
  name: string;
  start: string;
  end: string;
  time: string; //starting time
  price: number;
  headcount: number;
}

const DriverDetailCard: React.FC<InfoItem> = (props) => {
  const [totalOrder, setTotalOrder] = useState(0);
  const [abandonCount, setabandonCount] = useState(0);

  useEffect(() => {
    async function fetchPerson() {
      const response:userDTO = await getPerson(props.id) as userDTO;
      setTotalOrder(response.totalOrderCount);
      setabandonCount(response.abandonOrderCount);
    }
  },[]);

  return(
    <div className="flex flex-col w-[calc(100%-80px) bg-[#d9d9d9] p-[20px] rounded-[30px] text-[18px] justify-between gap-[20px]">
      <div className="flex flex-row justify-between">
        <div>
          <p className="text-[24px]">{props.name}</p>
          <span className=" whitespace-pre">人數：</span>
          <span>{props.headcount}</span><br />
          <span className="whitespace-pre">金額：</span>
          <span>{props.price}</span><br />
          <span className=" whitespace-pre">出發時間：</span>
          <span>{props.time}</span><br/>
        </div>
        <div className="flex flex-col mr-0 gap-[15px] justify-start items-center">
          <PersonalPage name={props.name} total={totalOrder} abandon={abandonCount}/>
          <DriverContact />
        </div>
      </div>
      <div>
        <span className=" whitespace-pre">起點：</span>
        <span>{props.start}</span><br />
        <span className=" whitespace-pre">終點：</span>
        <span>{props.end}</span><br />
      </div>
    </div>
  );
}

export default DriverDetailCard;
