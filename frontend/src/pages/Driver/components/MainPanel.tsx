import AutoCompleteInput from '../components/AutoCompleteInput';
import { setStart, setDest } from "../../../slices/driverStartDest"

type LatLngLiteral = google.maps.LatLngLiteral;
type MainPanelProps = {
  isLoaded: boolean;
  setStartPoint: (point: LatLngLiteral) => any;
  setDestPoint: (point: LatLngLiteral) => any;
};

const MainPanel = ({ isLoaded, setStartPoint, setDestPoint}: MainPanelProps) => {
  return <>
    {
      isLoaded && (
        <>
          <div className='flex flex-col justify-around items-center h-[30vh] bg-white rounded-t-3xl overflow-hidden z-10'>
            <div className='flex justify-between items-center w-[80vw] mt-4'>
              <div className='flex grow-[3] justify-start items-center'>
                <label htmlFor="departureTime">出發</label>
                <input type="datetime-local" id="departureTime" name="departureTime" className='bg-gray-200 rounded h-12 w-[12rem] ml-2 p-1' />
              </div>
              <div className='flex grow-0 justify-between items-center'>
                <label htmlFor="passNumber">人數</label>
                <select name="passNumber" id="passNumber" className='h-12 rounded w-10 text-center ml-1'>
                  {[...Array(10)].map((_, i) => <option value={i + 1}>{i + 1}</option>)}
                </select>
              </div>
            </div>

            <div className='flex justify-around items-center w-[90vw]'>
              <label htmlFor="start" >起點</label>
              <AutoCompleteInput type='driverStart' setLocation={setStart} setPoint={setStartPoint} />
            </div>

            <div className='flex justify-around items-center w-[90vw]'>
              <label htmlFor="destination" >終點</label>
              <AutoCompleteInput type='driverDest' setLocation={setDest} setPoint={setDestPoint} />
            </div>

            <button 
              className='rounded bg-cyan-800 w-[80vw] h-10  text-white text-xl'
              // onClick={() => navigate('/driver/pickup')}
            >
              選擇乘客
            </button>
          </div>
        </>
      )
    }
  </>;
}

export default MainPanel;