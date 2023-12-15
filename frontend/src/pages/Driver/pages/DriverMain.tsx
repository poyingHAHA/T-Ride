import DriverMap from '../components/DriverMap';
import { useEffect, useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setLocation } from '../../../slices/location';
import MainPanel from "../components/MainPanel";
import PickupPanel from '../components/PickupPanel';
import CheckoutPanel from '../components/CheckoutPanel';
import { orderDTO } from '../../../DTO/orders';
import { WaypointDTO } from '../../../DTO/waypoint';
import { setWaypoint } from '../../../slices/waypoint';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
const libraries:Libraries = ["marker", "places"];

const DriverMain = () => {
  const [directions, setDirections] = useState<DirectionsResult[]>([])
  const [startPoint, setStartPoint] = useState<LatLngLiteral>()
  const [destPoint, setDestPoint] = useState<LatLngLiteral>()
  // 0: mainPanel, 1: pickupPanel, 2: checkoutPanel
  const [panel, setPanel] = useState<number>(0)
  // 如果有點選marker，就把marker的orderId記錄下來，這樣可以把PickupCard的邊框變綠，表示這個card是被點選的
  const [markerOrderId, setMarkerOrderId] = useState<number | null>(null)
  // 紀錄使用者點選marker後，該地標附近的訂單
  const [orders, setOrders] = useState<orderDTO[]>([])
  // showSpots: 顯示所有地標
  const [showSpots, setShowSpots] = useState<boolean>(false)
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const waypointReducer = useAppSelector((state) => state.waypointReducer);
  const dispatch = useAppDispatch();
  
  // useJsApiLoader hook to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });

  useEffect(() => {
    fetchDirectionsOnce();
  }, [])
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const timestamp = position.timestamp;
      console.log("Index: ", position)
      dispatch(setLocation({ lat: latitude, lng: longitude, timestamp }));
    }, (error) => {
      console.log("Index: ", error)
    })

    if(!driverStartDestReducer.start || !driverStartDestReducer.dest) return;
    if(waypointReducer.waypoints.length === 0) {
      console.log("DriverMain 90: fetchDirectionsOnce")
      fetchDirectionsOnce();
      return;
    }
    fetchDirectionsWaypts(waypointReducer.waypoints);
  }, [startPoint, destPoint, isLoaded, tempOrderReducer.orders, driverStartDestReducer.start, driverStartDestReducer.dest, waypointReducer.waypoints])

  const fetchDirectionsOnce = async () => {
    if(!startPoint || ! destPoint) return;
    let waypts: WaypointDTO[] = []
    if(tempOrderReducer.orders.length > 0){
      console.log("DriverMain tempOrderReducer.orders: ", tempOrderReducer.orders)
      tempOrderReducer.orders.forEach((order) => {
        waypts.push({
          location: { lat: order.startPoint.lat, lng: order.startPoint.lng },
          stopover: true,
          startName: order.startName,
          time: order.pickTime1,
          orderId: order.orderId,
          pointType: "pickup",
          invitationStatus: order.invitationStatus
        })
        waypts.push({
          location: { lat: order.endPoint.lat, lng: order.endPoint.lng },
          stopover: true,
          endName: order.endName,
          time: order.pickTime2,
          orderId: order.orderId,
          pointType: "dropoff",
          invitationStatus: order.invitationStatus
        })
      })
    }
    // add start and destination to waypts
    waypts.unshift({
      location: { lat: startPoint.lat, lng: startPoint.lng },
      stopover: true,
      orderId: driverStartDestReducer.order.orderId as number,
      pointType: "driverStart"
    })
    waypts.push({
      location: { lat: destPoint.lat, lng: destPoint.lng },
      stopover: true,
      orderId: driverStartDestReducer.order.orderId as number,
      pointType: "driverEnd"
    })

    dispatch(setWaypoint(waypts));
    console.log("DriverMain 96: ", waypts)
    setDirections([]);
    const service = new google.maps.DirectionsService();
    for(let [index, waypt] of waypts.entries()){
      if(index === waypts.length - 1) return;
      if(waypt.location !== undefined && waypts[index + 1].location !== undefined){
        await service.route(
            {
              origin: waypt.location,
              destination: waypts[index + 1].location as google.maps.LatLngLiteral,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === 'OK' && result) {
                console.log("DriverMain 97: ", result)
                setDirections((prev) => [...prev, result]);
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
        )
      }
    }
  }

  const fetchDirectionsWaypts = async (waypoints: WaypointDTO[]) => {
    setDirections([]);
    const service = new google.maps.DirectionsService();
    for(let [index, waypt] of waypoints.entries()){
      if(index === waypoints.length - 1) return;
      if(waypt.location !== undefined && waypoints[index + 1].location !== undefined){
        await service.route(
            {
              origin: waypt.location,
              destination: waypoints[index + 1].location as google.maps.LatLngLiteral,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === 'OK' && result) {
                console.log("DriverMain 140: ", result)
                setDirections((prev) => [...prev, result]);
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
        )
      }
    }
  }

  return <>
  {
    isLoaded && (
      <>
        <div className='h-[60%] min-h-0'>
          <div className="relative bg-gray-200 flex justify-center items-center h-full z-0">
            <DriverMap isLoaded={isLoaded} directions={directions} showSpots={showSpots} setOrders={setOrders} orders={orders} setMarkerOrderId={setMarkerOrderId} />
          </div>
        </div>
        <div className='absolute h-fit overflow-auto bottom-0 z-100 min-h-[45%] w-[100%]'>
          {
            (() => {
              switch(panel){
                case 0:
                  return <MainPanel isLoaded={isLoaded} setStartPoint={setStartPoint} setDestPoint={setDestPoint} setPanel={setPanel} setShowSpots={setShowSpots} />
                case 1:
                  return <PickupPanel isLoaded={isLoaded} setPanel={setPanel} orders={orders} markerOrderId={markerOrderId} setShowSpots={setShowSpots} /> 
                case 2:
                  return <CheckoutPanel isLoaded={isLoaded} setPanel={setPanel} setShowSpots={setShowSpots} />
              }

            })()
          }
        </div>
      </>
    )
  }
  </>
}

export default DriverMain