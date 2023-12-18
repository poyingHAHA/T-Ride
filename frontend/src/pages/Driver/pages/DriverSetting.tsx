import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UnsetCookie, getTokenFromCookie } from '../../../utils/cookieUtil';
import { useDispatch } from "react-redux";
import { resetState } from "../../../store";

export default function DriverSetting() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        UnsetCookie();
        dispatch(resetState());
        navigate("/");
    }

    return (
        <div className='flex flex-col'>

            <div>

                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100">
                        <MdAccountCircle className="pr-3 mr-3 ml-1 h-10 w-10" />
                        <div className="text-neutral-800 dark:text-white text-lg">Account </div>
                    </button>
                </div>


                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100"
                        onClick={logoutHandler}>
                        <div className="text-neutral-800 text-red-500 dark:text-white text-lg">Log out</div>
                    </button>
                </div>
            </div>
        </div >
    )
}