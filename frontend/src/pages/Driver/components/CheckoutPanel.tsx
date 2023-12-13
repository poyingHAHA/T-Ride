import { useAppDispatch, useAppSelector } from "../../../hooks";
import { removeTempOrder, setTempOrder } from "../../../slices/tempOrder";
import { useRef, useEffect, useState } from "react";
import { getDriverUnfinishedOrder, getInvitationTotal } from "../../../services/driveOrderService";
import { postInvitation } from "../../../services/invitationService";
import { useNavigate } from "react-router-dom";
import { UnsetCookie } from "../../../utils/cookieUtil";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type CheckoutPanelProps = {
  isLoaded: boolean;
  setPanel: (panel: number) => any;
  setShowSpots?: (showSpots: boolean) => void;
};

const CheckoutPanel = ({ isLoaded, setPanel, setShowSpots }: CheckoutPanelProps) => {
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const [invitatedOrders, setInvitatedOrders] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dragOrder = useRef<number>(0);
  const draggedOverPerson = useRef<number>(0);
  const [dirverOrderId, setDirverOrderId] = useState<number|null>(null);
  const handleSort = () => {
    const tempOrdersClone = [...tempOrderReducer.orders];
    const temp = tempOrdersClone[dragOrder.current];
    tempOrdersClone[dragOrder.current] = tempOrdersClone[draggedOverPerson.current];
    tempOrdersClone[draggedOverPerson.current] = temp;
    dispatch(setTempOrder(tempOrdersClone));
  }

  useEffect(() => {
    setInvitatedOrders(tempOrderReducer.orders.map((order) => order.orderId));
    const getDirverOrderId = async () => {
      try{
        const res = await getDriverUnfinishedOrder();
        setDirverOrderId(res.data[0].orderId);
        if(res.data.length == 0){
          alert('您尚未設定訂單')
          setPanel(0)
        }
      }catch(err){
        console.log(err);
      }
    }
    getDirverOrderId();
  }, [])

  const handleInvitation = async () => {
    if(!dirverOrderId){
      try{
        const res = await getDriverUnfinishedOrder();
        setDirverOrderId(res.data[0].orderId);
        if(res.data.length == 0){
          alert('您尚未設定訂單')
          setPanel(0)
          return;
        }
      }catch(err){
        console.log(err);
      }
    }else{
      let passengerOrderIds = tempOrderReducer.orders.map((order) => order.orderId);
      for(const order of passengerOrderIds){
        passengerOrderIds = passengerOrderIds.filter((id) => id !== order);
      }
      console.log("CheckoutPanel 68", passengerOrderIds)
      if(passengerOrderIds.length === 0){
        navigate('/driver/info');
        return;
      }
      
      const res = await postInvitation(dirverOrderId, passengerOrderIds);
      console.log("CheckoutPanel 74", res)
      if(res?.success === 0){
        alert("Invlid token, 請重新登入")
        UnsetCookie();
        navigate('/login');
        return;
      }else{
        navigate('/driver/info');
      }
    }
  }

  const onDragEnd = (result: any) => {
  }

  return <>
    {
      isLoaded && (
        <>
          <div className='flex flex-col items-center h-[100%] bg-white rounded-t-3xl overflow-hidden z-50 '>
            <div className='flex items-center justify-evenly bg-white w-[100vw] mt-0'>
              <div className="mt-2">
                <p>
                  乘客人數 <span className='ml-1'>
                    {
                      tempOrderReducer.orders.reduce((accumulator, currentValue) => accumulator+currentValue.passengerCount, 0)
                    }
                  </span> / <span>{driverDepart.passengerCount}</span> 人
                </p>
              </div>
              <div className="mt-2" >
                <p>
                  總金額<span className='ml-1'>0</span>元
                </p>
              </div>
            </div>

            <div className="flex flex-col h-[32vh] w-[100%] overflow-scroll mt-4">
              <div  className="relative flex justify-center w-[100%] h-[12%] mt-4">
                <div className="flex justify-center items-center bg-black text-white rounded-md w-[70%] ">
                  <div>起點：{driverStartDestReducer.start.name}</div>
                </div>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {
                    (provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-col justify-center items-center w-[100%]"
                      >
                        {tempOrderReducer.orders && tempOrderReducer.orders.map((order, index) => (
                          <Draggable draggableId={order.orderId.toString()} index={index} >
                            {
                              provided => (
                                <div 
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  className="relative flex justify-center w-[100%] h-[5vh] mt-4"
                                >
                                  <div className="flex justify-between items-center px-4 bg-gray-200 rounded-md w-[70%] ">
                                    <div>{order.startName}</div>
                                    <div>{order.pickTime1}-{order.pickTime2}</div>
                                  </div>
                                  {
                                    order.invitationStatus.invitated ? (
                                      order.invitationStatus.accepted ? (
                                        <div className="flex justify-center items-center rounded-lg bg-green-500 w-[14%] text-white ml-2">  
                                          已接受
                                        </div>
                                      ):(
                                        <div className="flex justify-center items-center rounded-lg bg-cyan-800 w-[14%] text-white ml-2">  
                                          邀請中
                                        </div>
                                      )
                                    ) : (
                                      <button 
                                        className="rounded-lg bg-cyan-800 w-[14%] text-white ml-2"
                                        onClick={() => dispatch(removeTempOrder(order))}
                                      >
                                        移除
                                      </button>
                                    )
                                  }                   
                                </div>
                              )
                            }
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )
                  }
                </Droppable>
              </DragDropContext>
              {/* {
                tempOrderReducer.orders && tempOrderReducer.orders.map((order, index) => (
                  <div 
                    className="relative flex justify-center w-[100%] h-[16%] mt-4"
                    draggable={true}
                    onDragStart={() => (dragOrder.current = index)}
                    onDragEnter={() => (draggedOverPerson.current = index)}
                    onDragEnd={handleSort}
                  >
                    <div className="flex justify-between items-center px-4 bg-gray-200 rounded-md w-[70%] ">
                      <div>{order.startName}</div>
                      <div>{order.pickTime1}-{order.pickTime2}</div>
                    </div>
                    {
                      order.invitationStatus.invitated ? (
                        order.invitationStatus.accepted ? (
                          <div className="flex justify-center items-center rounded-lg bg-green-500 w-[14%] text-white ml-2">  
                            已接受
                          </div>
                        ):(
                          <div className="flex justify-center items-center rounded-lg bg-cyan-800 w-[14%] text-white ml-2">  
                            邀請中
                          </div>
                        )
                       ) : (
                        <button 
                          className="rounded-lg bg-cyan-800 w-[14%] text-white ml-2"
                          onClick={() => dispatch(removeTempOrder(order))}
                        >
                          移除
                        </button>
                      )
                    }                   
                  </div>
                ))
              } */}
              <div  className="relative flex justify-center w-[100%] h-[12%] mt-4">
                <div className="flex justify-center items-center bg-black text-white rounded-md w-[80%] ">
                  <div>終點：{driverStartDestReducer.dest.name}</div>
                </div>
              </div>
            </div>

            <div className='fixed bottom-20 flex justify-center w-[100%]'>
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
                onClick={handleInvitation}
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