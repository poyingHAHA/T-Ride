import { MdHomeFilled, MdOutlineRoute, MdHistory, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const DriverNavbar: React.FC = () => {
  const navigate = useNavigate()
  
  return <>
    <nav className="bg-white flex flex-col items-stretch">
      <div className="flex w-full items-stretch justify-between gap-5 px-14 py-4 border-t-2 border-gray-200 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <button className="rounded-full bg-amber-200 p-2" onClick={() => navigate("/driver")} >
          <MdHomeFilled className="text-4xl text-black" />
        </button>
        <button className="rounded-full bg-amber-200 p-2" onClick={() => navigate("/driver/route")} >
          <MdOutlineRoute className="text-4xl text-black" />
        </button>
        <button className="rounded-full bg-amber-200 p-2" onClick={() => navigate("/driver/history")} >
          <MdHistory className="text-4xl text-black" />
        </button>
        <button className="rounded-full bg-amber-200 p-2" onClick={() => navigate("/driver/setting")} >
          <MdSettings  className="text-4xl text-black" />
        </button>
      </div>
    </nav>
  </>
}

export default DriverNavbar;