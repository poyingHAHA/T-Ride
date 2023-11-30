import { orderDTO } from "../../../DTO/orders";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import PickupCard from "./PickupCard";
import { useState,useEffect } from "react";
import { removeTempOrder } from "../../../slices/tempOrder";

type LatLngLiteral = google.maps.LatLngLiteral;
type CheckoutPanelProps = {
  isLoaded: boolean;
  setPanel: (panel: number) => any;
  setShowSpots?: (showSpots: boolean) => void;
};

const CheckoutPanel = ({ isLoaded, setPanel, setShowSpots }: CheckoutPanelProps) => {
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const dispatch = useAppDispatch();

  return <>
    {
      isLoaded && (
        <>
          <div className='flex flex-col items-center h-[100%] bg-white rounded-t-3xl overflow-hidden z-50 '>
            <div className='flex items-center justify-evenly bg-white w-[100vw] mt-0'>
              <div className="mt-2">
                <p>
                  乘客人數 <span className='ml-1'>{tempOrderReducer.orders.length}</span> / <span>{driverDepart.passengerCount}</span> 人
                </p>
              </div>
              <div className="mt-2" >
                <p>
                  總金額<span className='ml-1'>0</span>元
                </p>
              </div>
            </div>

            <div className="flex flex-col h-[80%] w-[100%] overflow-scroll mt-4">
              {
                tempOrderReducer.orders && tempOrderReducer.orders.map((order) => (
                  <div className="flex justify-center w-[100%] h-[15%] mt-4">
                    <div className="flex justify-between items-center px-4 bg-gray-200 rounded-md w-[70%] ">
                      <div>{order.startName}</div>
                      <div>{order.pickTime1}-{order.pickTime2}</div>
                    </div>                   
                    <button 
                      className="rounded-lg bg-cyan-800 w-[15%] text-white ml-2"
                      onClick={() => dispatch(removeTempOrder(order))}
                    >
                      移除
                    </button>
                  </div>
                ))
              }
            </div>

            <div className='fixed bottom-4 flex justify-center w-[100%]'>
              <button 
                className='rounded bg-[#f3e779] w-[25vw] h-10 text-xl mr-4' 
                onClick={() => {
                  setPanel(1);
                  setShowSpots && setShowSpots(true);
                }}
              >
                返回
              </button>

              <button 
                className='rounded bg-cyan-800 w-[60vw] h-10 text-white text-xl'
                onClick={() => {
                  // dispatch(addOrder({orders: tempOrders}));
                  // setShowSpots && setShowSpots(false);
                }}
              >
                送出邀請
              </button>
            </div>
          </div>
        </>
      )
    }
  </>;
}

export default CheckoutPanel;