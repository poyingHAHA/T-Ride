import React from 'react';
import DriverMap from '../../components/DriverMap';
import DriverNavbar from '../../components/DriverNavbar';

const tempLocation = [
  "台北市",
  "新北市",
  "桃園市",
  "台中市",
  "台南市",
  "高雄市",
  "基隆市",
  "新竹市",
  "嘉義市",
  "新竹縣",
  "苗栗縣",
  "彰化縣",
  "南投縣",
]

const DriverMain: React.FC = () => {
  return <>
    <div className='flex flex-col justify-between'>
      <div className='grow h-[58vh] scale-110'>
        <DriverMap />
      </div>
      
      <div className='flex flex-col justify-around items-center h-[30vh] bg-white rounded-t-3xl overflow-hidden z-10'>
        <div className='flex justify-between items-center w-[80vw]'>
          <div className='flex grow-[3] justify-start items-center'>
            <label htmlFor="departureTime">出發</label>
            <input type="datetime-local" id="departureTime" name="departureTime" className='bg-gray-200 rounded h-12 w-[12rem] ml-2 p-1' />
          </div>
          <div className='flex grow-0 justify-between items-center'>
            <label htmlFor="passNumber">人數</label>
            <select name="passNumber" id="passNumber" className='h-12 rounded w-10 text-center' >
              {[...Array(10)].map((_, i) => <option value={i + 1}>{i + 1}</option>)}
            </select>
          </div>
        </div>

        <div className='flex justify-around items-center w-[80vw]'>
          <label htmlFor="start" className='grow' >起點</label>
          <select name="start" id="start" className='grow-[8] h-12 rounded' >
            {tempLocation.map((location, idx) => <option value={location}>{location}</option>)}
          </select>
        </div>
        <div className='flex justify-around items-center w-[80vw]'>
          <label htmlFor="destination" className='grow' >終點</label>
          <select name="destination" id="destination" className='grow-[8] h-12 rounded' >
            {tempLocation.map((location, idx) => <option value={location}>{location}</option>)}
          </select>
        </div>
      </div>
      <div className='grow-0 absolute inset-x-0 bottom-0'>
        <DriverNavbar />
      </div>
    </div>
  </>
}

export default DriverMain;