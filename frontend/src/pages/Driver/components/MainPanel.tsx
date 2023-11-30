import AutoCompleteInput from '../components/AutoCompleteInput';
import { setStart, setDest } from "../../../slices/driverStartDest"
import { setDepartureTime, setPassengerCount } from '../../../slices/driverDepart';
import { useAppDispatch, useAppSelector } from "../../../hooks";

type LatLngLiteral = google.maps.LatLngLiteral;
type MainPanelProps = {
  isLoaded: boolean;
  setStartPoint: (point: LatLngLiteral) => any;
  setDestPoint: (point: LatLngLiteral) => any;
  setPanel: (panel: number) => any;
  setShowSpots: (showSpots: boolean) => any;
};
const MainPanel = ({ isLoaded, setStartPoint, setDestPoint, setPanel, setShowSpots}: MainPanelProps) => {
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const dispatch = useAppDispatch();

  const handleSelectPassengerCount = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const passengerCount = parseInt(event.target.value);
    dispatch(setPassengerCount(passengerCount));
    console.log(driverDepart)
  }
  const handleChangeDepartureTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const departureTime = new Date(e.target.value).getTime() / 1000;
    dispatch(setDepartureTime(departureTime));
    console.log(driverDepart)
  }

  return <>
    {
      isLoaded && (
        <>
          <div className='flex flex-col justify-around items-center h-[100%] bg-white rounded-t-3xl overflow-hidden z-50'>
            <div className='flex justify-between items-center w-[80vw] mt-4'>
              <div className='flex grow-[3] justify-start items-center'>
                <label htmlFor="departureTime">出發</label>
                <input 
                  type="datetime-local" 
                  id="departureTime"
                  value={driverDepart.departureTime ? new Date(driverDepart.departureTime * 1000+8*60*60*1000).toISOString().slice(0, -8) : ""}
                  name="departureTime" 
                  className='bg-gray-200 rounded h-12 w-[12rem] ml-2 p-1' 
                  onChange={(e)=>handleChangeDepartureTime(e)} 
                />
              </div>
              <div className='flex grow-0 justify-between items-center'>
                <label htmlFor="passNumber">人數</label>
                <select name="passNumber" id="passNumber" className='h-12 rounded w-10 text-center ml-1' onChange={handleSelectPassengerCount} >
                  {
                    [...Array(10)].map((_, i) => 
                      driverDepart.passengerCount === i + 1 ? <option value={i+1} selected>{i+1}</option> : <option value={i + 1}>{i + 1}</option>
                    )
                  }
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
              // disabled={driverStartDestReducer.start === undefined || driverStartDestReducer.dest===undefined || driverDepart.departureTime===undefined || driverDepart.passengerCount===0}
              onClick={() => {
                if(driverStartDestReducer.start === undefined || driverStartDestReducer.dest===undefined || driverDepart.departureTime===undefined || driverDepart.passengerCount===0) {
                  alert("請填寫完整資料")
                  return;
                }
                setPanel(1)
                setShowSpots(true)
              }}
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