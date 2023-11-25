import { orderDTO } from "../../../DTO/orders";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import PickupCard from "./PickupCard";

type LatLngLiteral = google.maps.LatLngLiteral;
type PickupPanelProps = {
  isLoaded: boolean;
  setPickupPanel: (pickupPanel: boolean) => any;
  orders?: orderDTO[];
};

const PickupPanel = ({ isLoaded, setPickupPanel, orders }: PickupPanelProps) => {
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);

  return <>
    {
      isLoaded && (
        <>
          <div className='flex flex-col items-center h-[100%] bg-white rounded-t-3xl overflow-hidden z-50 '>
            <div className='flex items-center justify-evenly bg-white w-[100vw] mt-0'>
              <div className="mt-2">
                <p>
                  乘客人數 <span className='ml-1'>0</span> / <span>{driverDepart.passengerCount}</span> 人
                </p>
              </div>
              <div className="mt-2" >
                <p>
                  總金額<span className='ml-1'>0</span>元
                </p>
              </div>
            </div>

            <div className="flex flex-col h-[80%] w-[100%] overflow-scroll">
              {
                orders && orders.map((order) => (
                  <PickupCard key={order.orderId} order={order} />
                ))
              }
            </div>

            <div className='fixed bottom-4 flex justify-center w-[100%]'>
              <button 
                className='rounded bg-[#f3e779] w-[25vw] h-10 text-xl mr-4' 
                onClick={() => setPickupPanel(false)}
              >
                返回
              </button>

              <button 
                className='rounded bg-cyan-800 w-[60vw] h-10 text-white text-xl'
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