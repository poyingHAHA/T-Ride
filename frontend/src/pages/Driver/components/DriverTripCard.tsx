interface PlaceProps {
  type: string;
  name: string; 
  time: string;
  // place: {
  //   lat: number,
  //   lng: number
  // }
}

const DriverTripCard: React.FC<PlaceProps> = (props) => {
  return(
    <div className="bg-[#d9d9d9] flex flex-row justify-between p-[20px] rounded-[10px] w-[calc(100vw-80px)]">
      <div className="flex flex-col">
        <span className="justify-center text-[18px] font-sans">{props.type}</span>
        <span className="justify-center text-[18px] font-sans">{props.name}</span>
      </div>
      <span className="text-[32px] font-sans">{props.time}</span>
    </div>
  );
}

export default DriverTripCard;