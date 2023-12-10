import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { HiOutlineXCircle } from "react-icons/hi2";
import { deleteDriverInvitation  } from "../../../services/driveOrderService";
import { getTokenFromCookie } from '../../../utils/cookieUtil';

interface PopupProps {
    text: string;
	tag: boolean;
    driverOrderId: number;
    passengerOrderId: number;
}

const DriverPopup: React.FC<PopupProps> = (props) => {
    const token = getTokenFromCookie();
    async function handleDelete(){
        try {
            const response = await deleteDriverInvitation(
                props.driverOrderId,
                props.passengerOrderId,
                token
            );
            console.log("response",response);
        } catch (error) {
            console.log(error);
        }
    }

    //handle modal
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => {
      setShowModal(true);
    };
    const handleCloseModal = () => {
      setShowModal(false);
    };
    return (
        <div>
            <button 
                onClick={handleOpenModal}
                className="bg-black text-white rounded-[10px] py-[10px] px-[20px] text-[18px] text-white"
            >{props.text}</button>
            <ReactModal 
                isOpen={showModal}
                className="w-screen h-screen flex justify-center items-center bg-[#ededed] ">
                <div className="flex flex-col justify-between w-[calc(100vw-80px)] h-[calc(100vh-430px)] bg-white shadow rounded-[30px] p-[10px]">
                    <button onClick={handleCloseModal}>
                        <HiOutlineXCircle className='w-[50px] h-[50px] ml-auto'/>
                    </button>
                    <p className='text-center text-[36px]'>是否{props.text}邀請？</p>
                    <button 
                        className='bg-black w-[145px] h-[50px] opacity-100 text-white text-[24px] rounded-[10px] mx-auto mb-[25px]'
                        onClick={() => {
                            handleDelete();
                            handleCloseModal();
                        }}
                    >確定</button>
                </div>
            </ReactModal>
        </div>
    );
}
export default DriverPopup;