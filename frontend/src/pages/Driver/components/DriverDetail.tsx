import { FaUser } from "react-icons/fa6";
import DriverContact from "../components/DriverContact";

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
  return(
    <div className="flex flex-row h-[220px] w-[calc(100%-80px) bg-[#F3E779] p-[20px] rounded-[30px] text-[18px] justify-between">
      <div>
        <p className="text-[24px]">{props.name}</p>
        <span className=" whitespace-pre">人數：</span>
        <span>{props.headcount}</span><br />
        <span className="whitespace-pre">金額：</span>
        <span>{props.price}</span><br />
        <span className=" whitespace-pre">起點：</span>
        <span>{props.start}</span><br />
        <span className=" whitespace-pre">終點：</span>
        <span>{props.end}</span><br />
        <span className=" whitespace-pre">出發時間：</span>
        <span>{props.time}</span>
      </div>
      <div className="flex flex-col mr-0 gap-[15px] justify-center items-center">
        <div className="w-[75px] h-[75px] bg-white rounded-full flex justify-center items-center">
          <FaUser className="w-[40px] h-[40px]"/>
        </div>
        <DriverContact />
      </div>
    </div>
  );
}

export default DriverDetailCard;