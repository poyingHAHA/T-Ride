import React, { useState }  from "react";
import ReactModal from 'react-modal';
import { HiOutlineXCircle } from "react-icons/hi2";
import { FaPhoneVolume } from "react-icons/fa6";

const DriverContact: React.FC = ()=> {
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
  const handleChange = () => {
  }

  return (
    <div>
      <button 
        onClick={handleOpenModal}
        className="w-[100px] bg-black text-white p-[5px] rounded-[10px]">
          聯絡乘客
      </button>
      <ReactModal 
        isOpen={showModal}
        className="w-screen h-screen flex justify-center items-center bg-[#ededed]">
        <div className="flex flex-col justify-center w-[calc(100vw-80px)] h-[calc(100vh-320px)] bg-white shadow rounded-[30px] p-[20px] gap-[25px]">
            <button onClick={handleCloseModal} className="absolute right-[50px] top-[180px]">
              <HiOutlineXCircle className='w-[50px] h-[50px]'/>
            </button>
          <div className="flex flex-row items-center gap-[40px]">
            <span className="text-[24px]">撥打電話</span>
            <button className="w-[60px] h-[60px] rounded-[30px] bg-[#d9d9d9] flex justify-center items-center">
              <FaPhoneVolume className="w-[25px] h-[25px]"/>
            </button>
          </div>
          <p className="text-[24px]">傳送訊息</p>
          <form className="flex flex-col gap-[30px] items-center" onSubmit={handleSubmit}>
            <input type="text" name="message1" value="已抵達上車地點" readOnly 
              className="w-full border-[1px] border-black p-[5px] rounded-[10px] text-center"/>
            <input type="text" name="message1" value="延遲五分鐘抵達" readOnly
              className="w-full border-[1px] border-black p-[5px] rounded-[10px] text-center"/>
            <input type="text" name="message" placeholder="請輸入訊息" 
              className="w-full border-[1px] border-black p-[5px] rounded-[10px] text-center"
              onChange={handleChange}
              /><br/>
            <input type="submit" value="送出" 
              className="w-[145px] h-[50px] bg-black rounded-[10px] text-white text-[24px]"/>
          </form>
        </div>
      </ReactModal>
    </div>

  );
};

export default DriverContact;