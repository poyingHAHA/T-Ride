const Card1: React.FC<{
  name: string;
  time: string;
}> = (props) => {
  return (
    <div className="bg-[#d9d9d9] rounded-[10px] p-[20px] w-[calc(100vw-80px)] text-[18px] font-sans whitespace-pre">
      {props.name}    {props.time}
    </div>
  );
}

export default Card1;