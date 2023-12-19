import React, { useState }  from "react";
import ReactModal from 'react-modal';
import { HiOutlineXCircle } from "react-icons/hi2";
import { FaUser } from "react-icons/fa6";

ReactModal.setAppElement('#root'); 

interface Person {
  name: string;
  total: number;
  abandon: number;
}

const PersonalPage: React.FC<Person> = (props)=> {
    //handle modal
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => {
      setShowModal(true);
    };
    const handleCloseModal = () => {
      setShowModal(false);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault(); //prevent refreshing the page
    };
  
    return (
      <div>
        <button 
          onClick={handleOpenModal}
          className="w-[75px] h-[75px] bg-white rounded-full flex justify-center items-center">
            <FaUser className="w-[40px] h-[40px]"/>
        </button>
        <ReactModal 
          isOpen={showModal}
          className="w-screen h-screen flex justify-center items-center bg-[#ededed]">
          <div className="flex flex-col justify-center items-end w-[calc(100vw-80px)] h-[calc(100vh-320px)] bg-white shadow rounded-[30px] p-[20px] gap-[30px]">
              <button onClick={handleCloseModal} className="right-[50px] text-right">
                <HiOutlineXCircle className='w-[50px] h-[50px]'/>
              </button>
              <div className="w-full flex flex-start gap-[30px] items-center">
                <div className="w-[100px] h-[100px] bg-[#D9D9D9] rounded-full flex justify-center items-center">
                  <FaUser className="w-[60px] h-[60px]"/>
                </div>
                <span className="text-[24px]">{props.name}</span>
              </div>
              <div className="w-[100%] flex flex-col justify-center h-[70%] bg-[#D9D9D9] p-[20px] rounded-[10px] text-[18px]">
                <p>總共搭乘次數： {props.total}</p>
                <p>總共棄單次數： {props.abandon}</p>
              </div>
              <button className="w-full h-[60px] bg-black rounded-[10px] text-white text-[24px]">
                加入好友
              </button>
          </div>
        </ReactModal>
      </div>
    );
};

export default PersonalPage;