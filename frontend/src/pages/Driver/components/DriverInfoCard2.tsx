import Popup from '../components/DriverPopup';

interface Card2Props {
  orderId: number,
  userName: string;
  startName: string;
  endName: string;
  pickTime: string;
  state: boolean;
  handleDelete: (passengerOrderId:number) => Promise<void>;
}

const Card2: React.FC<Card2Props> = (props) => {
  return (
    <div className="bg-[#d9d9d9] flex flex-col p-[20px] gap-[15px] rounded-[10px] w-[calc(100vw-80px)]">
      <div className="flex flex-row justify-between items-center">
        <div className="text-[24px] font-sans flex gap-[10px] items-center">
          {props.userName}
          {props.state ? (<span className='text-[16px]'>已接受</span>) : (<span className='text-[16px]'>未接受</span>)}
        </div>
        <div className="flex flex-row gap-[10px]">
          {!props.state && (
            <Popup text={"取消"} passengerOrderId={props.orderId} handleDelete={props.handleDelete} />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[5px]">
        <div>
          <span className="text-[18px] whitespace-pre">起點：</span>
          <span className="text-[18px] font-bold">{props.startName}</span>
        </div>
        <div>
          <span className="text-[18px] whitespace-pre">終點：</span>
          <span className="text-[18px] font-bold">{props.endName}<br /></span>
        </div>
        <div>
          <span className="text-[18px] whitespace-pre">出發時間：</span>
          <span className="text-[18px]">{props.pickTime}</span>
        </div>
      </div>
    </div>
  );
}

export default Card2;