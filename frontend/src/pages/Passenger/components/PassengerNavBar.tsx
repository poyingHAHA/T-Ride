import React from 'react';
import { useNavigate } from "react-router-dom";
import { MdHome, MdOutlineStar, MdHistory, MdAccountCircle } from "react-icons/md";

const PassengerNavbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="px-3 bg-white shadow-lg border-gray border-t-2 border-solid">
            <div className="flex">
                <div className="flex-1 group">
                    <button className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-black"
                        onClick={() => navigate("/passenger")} >
                        <span className="block px-1 pt-1 pb-1">
                            <MdHome className="text-2xl pt-1 mb-1 block mx-auto" />
                            <span className="block text-xs pb-2 mx-auto">Home</span>
                            <span className="block w-5 mx-auto h-1 group-hover:bg-black rounded-full"></span>
                        </span>
                    </button>
                </div>
                <div className="flex-1 group">
                    <a className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-black"
                        onClick={() => navigate("/passenger/Route")}>
                        <span className="block px-1 pt-1 pb-1">
                            <MdOutlineStar className="far fa-compass text-2xl pt-1 mb-1 block mx-auto" />
                            <span className="block text-xs pb-2 mx-auto">Favorite</span>
                            <span className="block w-5 mx-auto h-1 group-hover:bg-black rounded-full"></span>
                        </span>
                    </a>
                </div>
                <div className="flex-1 group">
                    <a className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-black"
                        onClick={() => navigate("/passenger/History")} >
                        <span className="block px-1 pt-1 pb-1">
                            <MdHistory className="far fa-search text-2xl pt-1 mb-1 block mx-auto" />
                            <span className="block text-xs pb-2 mx-auto">History</span>
                            <span className="block w-5 mx-auto h-1 group-hover:bg-black rounded-full"></span>
                        </span>
                    </a>
                </div>
                <div className="flex-1 group">
                    <button className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-black"
                        onClick={() => navigate("/passenger/Account")} >
                        <span className="block px-1 pt-1 pb-1">
                            <MdAccountCircle className="far fa-cog text-2xl pt-1 mb-1 block mx-auto" />
                            <span className="block text-xs pb-2 mx-auto">Account</span>
                            <span className="block w-5 mx-auto h-1 group-hover:bg-black rounded-full"></span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PassengerNavbar;