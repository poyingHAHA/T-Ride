const Card1: React.FC<{
  name: string;
  time: string;
}> = (props) => {
  return (
    <div className="bg-[#d9d9d9] rounded-[10px] p-[20px] w-[calc(100vw-80px)] text-[18px] font-sans flex flex-wrap">
      <span className="w-full">{props.name}</span>
      <span className="w-full">{props.time}</span>
    </div>
  );
}

export default Card1;