import DriverMap from '../components/DriverMap';
import { useEffect, useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setLocation } from '../../../slices/location';
import MainPanel from "../components/MainPanel";
import PickupPanel from '../components/PickupPanel';
import CheckoutPanel from '../components/CheckoutPanel';
import { orderDTO } from '../../../DTO/orders';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
const libraries:Libraries = ["marker", "places"];

const DriverMain = () => {
  const [directions, setDirections] = useState<DirectionsResult>()
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
  const dispatch = useAppDispatch();
  
  // useJsApiLoader hook to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });
  
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
    fetchDirections();
  }, [startPoint, destPoint, isLoaded, tempOrderReducer])

  const fetchDirections = () => {
    if(!startPoint || ! destPoint) return;
    let waypts: google.maps.DirectionsWaypoint[] = []
    if(tempOrderReducer.orders.length > 0){
      console.log("DriverMain tempOrderReducer.orders: ", tempOrderReducer.orders)
      tempOrderReducer.orders.forEach((order) => {
        waypts.push({
          location: { lat: order.startPoint.lat, lng: order.startPoint.lng },
          stopover: true,
        })
      })
      // 根據起點與終點進行waypoints的排序,如果是南下則由北往南排序,反之則由南往北排序
      if(startPoint.lat >= destPoint.lat){
        waypts.sort((a, b) => {
          if(a.location !== undefined && b.location !== undefined){
            a.location = a.location as LatLngLiteral
            b.location = b.location as LatLngLiteral
            return a.location.lat - b.location.lat
          }
          else{
            return 0
          }
        })
      }
      else{
        waypts.sort((a, b) => {
          if(a.location !== undefined && b.location !== undefined){
            a.location = a.location as LatLngLiteral
            b.location = b.location as LatLngLiteral
            return b.location.lat - a.location.lat
          }
          else{
            return 0
          }
        })
      }

    }
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: {lat: startPoint.lat, lng: startPoint.lng},
        waypoints: waypts,
        destination: {lat: destPoint.lat, lng: destPoint.lng},
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  return <>
  {
    isLoaded && (
      <>
        <div className='h-[60%]'>
          <div className="bg-gray-200 flex justify-center items-center h-full">
            <DriverMap isLoaded={isLoaded} directions={directions} showSpots={showSpots} setOrders={setOrders} orders={orders} setMarkerOrderId={setMarkerOrderId} />
          </div>
        </div>
        <div className='h-[45%] bottom-0 z-100 -translate-y-10'>
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