import React from 'react'
import { MdSettings, MdOutlineCreditCard, MdOutlineContactSupport, MdAccountCircle, MdOutlineStar, MdHistory } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getUserinfo } from '../../../services/userService';


export default function DriverAccount() {

    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        const getUserName = async () => {
            try {
                const Userinfo = await getUserinfo();
                setUserName(Userinfo.data.userName)
            } catch (err) {
                setError("發生錯誤");
            }
        }
        getUserName();
    }, [])
    return (
        <div className='flex flex-col'>
            <div className='bg-gray-200 px-6 py-10 flex'>

                <div className='flex-1 flex items-center justify-center ' >
                    <div className='text-neutral-800 text-4xl'>{userName}</div>
                </div>
                <MdAccountCircle className=' h-20 w-20 flex-1' />
            </div>
            <div>
                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100"
                        onClick={() => navigate("/driver/setting")}>
                        <MdSettings className="pr-3 mr-3 ml-1 h-10 w-10" />
                        <div className="text-neutral-800 dark:text-white text-lg">
                            Settings
                        </div>
                    </button>
                </div>
                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100">
                        <MdOutlineCreditCard className="pr-3 mr-3 ml-1 h-10 w-10" />
                        <div className="text-neutral-800 dark:text-white text-lg">Wallet</div>
                    </button>
                </div>
                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100">
                        <FaUserFriends className="pr-3 mr-3 ml-1 h-10 w-10" />
                        <div className="text-neutral-800 dark:text-white text-lg">Friends</div>
                    </button>
                </div>
                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100">
                        <MdOutlineStar className="pr-3 mr-3 ml-1 h-10 w-10" />
                        <div className="text-neutral-800 dark:text-white text-lg">Favorite</div>
                    </button>
                </div>
                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100">
                        <MdHistory className="pr-3 mr-3 ml-1 h-10 w-10" />
                        <div className="text-neutral-800 dark:text-white text-lg">History</div>
                    </button>
                </div>
                <div className="group">
                    <button className="flex w-full items-center px-6 py-5 group-hover:bg-gray-100">
                        <MdOutlineContactSupport className="pr-3 mr-3 ml-1 h-10 w-10" />
                        <div className="text-neutral-800 dark:text-white text-lg">Support</div>
                    </button>
                </div>



            </div>
        </div >
    )
}

