import { useAppDispatch, useAppSelector } from "../../../hooks";
import { removeTempOrder, setTempOrder } from "../../../slices/tempOrder";
import { useRef, useEffect, useState } from "react";
import { getDriverUnfinishedOrder, getInvitationTotal } from "../../../services/driveOrderService";
import { postInvitation } from "../../../services/invitationService";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { orderDTO } from "../../../DTO/orders";
import { WaypointDTO } from "../../../DTO/waypoint";
import { removeWaypoint, setWaypoint } from "../../../slices/waypoint";
import { getColor } from "../../../utils/colorUtil";
import { resetState } from "../../../store";

type CheckoutPanelProps = {
  isLoaded: boolean;
  setPanel: (panel: number) => any;
  setShowSpots?: (showSpots: boolean) => void;
};

type column = {
  columnid: string;
  waypts: WaypointDTO[];
}

const CheckoutPanel = ({ isLoaded, setPanel, setShowSpots }: CheckoutPanelProps) => {
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const waypointReducer = useAppSelector((state) => state.waypointReducer);
  const [invitatedOrders, setInvitatedOrders] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [columns, setColumns] = useState<column[]>([{
    columnid: 'droppable',
    waypts: []
  }]);
  const [dirverOrderId, setDirverOrderId] = useState<number|null>(null);
  
  useEffect(() => {
    setInvitatedOrders(tempOrderReducer.orders.map((order) => order.orderId));
    setColumns([{columnid: 'droppable', waypts: waypointReducer.waypoints}]);
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
  }, [tempOrderReducer.orders, waypointReducer.waypoints])
  
  const handleInvitation = async () => {
    if(!dirverOrderId){
      try{
        const res = await getDriverUnfinishedOrder();
        setDirverOrderId(res.data[0].orderId);
        if(res.data.length === 0){
          alert('您尚未設定訂單')
          setPanel(0)
          return;
        }
      }catch(err){
        console.log(err);
      }
    }else{
      let passengerOrderIds = tempOrderReducer.orders.map((order) => order.orderId);
      dispatch(resetState());
      console.log("CheckoutPanel 68", passengerOrderIds)
      if(passengerOrderIds.length === 0){
        navigate('/driver/info');
        return;
      }
      
      const res = await postInvitation(dirverOrderId, passengerOrderIds);
      console.log("CheckoutPanel 74", res)
      navigate('/driver/info');
    }
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    console.log("CheckoutPanel 96", result)
    
    if(!destination){
      return;
    }
    if(destination.droppableId === source.droppableId && destination.index === source.index){
      return;
    }

    const waypointClone = [...waypointReducer.waypoints];
    const temp = waypointClone[source.index];
    waypointClone.splice(source.index, 1);
    waypointClone.splice(destination.index, 0, temp);
    console.log("CheckoutPanel 106", waypointClone)
    setColumns([{columnid: 'droppable', waypts: waypointReducer.waypoints}]);
    dispatch(setWaypoint(waypointClone)); 
  }

  const getCardClass = (index: number) => {
    return `flex flex-col justify-between px-4 bg-[${getColor(index).toLowerCase()}] rounded-md w-[70%] py-2`
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
              <div  className="relative flex justify-center w-auto h-auto px-2 mt-4">
                <div className="flex justify-center items-center w-[80%] bg-black text-white rounded-md ">
                  <div>起點：{driverStartDestReducer.start.name}</div>
                </div>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                {columns.map((col) => (
                  <Droppable droppableId={col.columnid} key={col.columnid} >
                    {
                      (provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex flex-col justify-center items-center w-[100%]"
                        >
                          {col.waypts.map((waypt, index) => (
                            index !== 0 && index !== col.waypts.length - 1 &&
                            <Draggable draggableId={waypt.orderId.toString()+waypt.pointType} index={index} key={waypt.orderId.toString()+waypt.pointType} >
                              {
                                provided => (
                                  <div 
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    className="relative flex justify-center w-[100%] mt-4"
                                  >
                                      {
                                        waypt.startName !== undefined ? (
                                          <div className={getCardClass(index-1)} style={{backgroundColor: `${getColor(index-1)}`}}>
                                            <div>出發: {waypt.startName}</div>
                                            <div>預計出發時間: {waypt.time}</div>
                                          </div>
                                        ) : (
                                          <div className={getCardClass(index-1)} style={{backgroundColor: `${getColor(index-1)}`}} >
                                            <div>終點: {waypt.endName}</div>
                                            <div>預計抵達時間: {waypt.time}</div>
                                          </div>
                                        )
                                      }
                                    {
                                      waypt.invitationStatus !== undefined &&
                                      waypt.invitationStatus.invitated ? (
                                        waypt.invitationStatus.accepted ? (
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
                                          onClick={() => {
                                            dispatch(removeTempOrder(waypt))
                                            dispatch(removeWaypoint(waypt))
                                          }}
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
                ))}
              </DragDropContext>
              <div  className="relative flex justify-center w-auto h-auto mt-4">
                <div className="flex justify-center items-center w-[80%] bg-black text-white rounded-md ">
                  <div className="px-1">終點：{driverStartDestReducer.dest.name}</div>
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