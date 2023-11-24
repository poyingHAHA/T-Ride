import AutoCompleteInput from '../components/AutoCompleteInput';
import { setStart, setDest } from "../../../slices/driverStartDest"

type LatLngLiteral = google.maps.LatLngLiteral;
type PickupPanelProps = {
  isLoaded: boolean;
  setPickupPanel: (pickupPanel: boolean) => any;
};

const PickupPanel = ({ isLoaded, setPickupPanel }: PickupPanelProps) => {
  return <>
    {
      isLoaded && (
        <>
          <>PickUp</>
          <div className='relative h-[31vh] bg-white rounded-t-3xl overflow-hidden z-10'>
            <div className='flex items-center justify-evenly w-[100vw] mt-4 '>
              <div>
                <p>
                  剩餘空位 
                  <span className='ml-1 text-xl'>
                    3
                  </span>
                  人
                </p>
              </div>
              <div>
                <p>
                  總金額
                  <span className='ml-1 text-xl'>
                    0
                  </span>
                  元
                </p>
              </div>
            </div>


            <div className='absolute bottom-0 flex justify-center w-[100%]'>
              <button 
                className='rounded bg-[#f3e779] w-[25vw] h-10 text-xl' 
                onClick={() => setPickupPanel(false)}
              >
                返回
              </button>

              <button 
                className='rounded bg-cyan-800 w-[60vw] h-10 text-white text-xl ml-4'
                // onClick={() => navigate('/driver/pickup')}
              >
                確認
              </button>
            </div>
          </div>
        </>
      )
    }
  </>;
}

export default PickupPanel;