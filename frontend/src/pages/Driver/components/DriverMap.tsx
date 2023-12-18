import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, DirectionsRenderer, InfoWindowF, OverlayView, Marker, Circle} from "@react-google-maps/api";
import AdvMarker from "./AdvancedMarker"
import { getSpots, getSpotOrders } from "../../../services/spotService";
import { orderDTO, SpotDTO } from "../../../DTO/orders";
import { getColor } from "../../../utils/colorUtil";
import React from "react";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type DriverMapProps = {
  isLoaded: boolean;
  showSpots?: boolean;
  directions?: DirectionsResult[];
  setOrders?: (orders: orderDTO[]) => void;
  orders?: orderDTO[];
  setMarkerOrderId?: (orderId: number) => void
};

const DriverMap = ({isLoaded, directions, showSpots, setOrders, orders, setMarkerOrderId}: DriverMapProps) => {
  const [tempOrderSpots, setTempOrderSpots] = useState<number[]>([]);
  const [tempOrders, setTempOrders] = useState<number[]>([]);
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const [currentCenter, setCurrentCenter] = useState<LatLngLiteral>({lat: locationReducer.lat || 0, lng: locationReducer.lng || 0});
  const location = { ...locationReducer}
  const [spots, setSpots] = useState<SpotDTO[]>([]);
  const [activeMarker, setActiveMarker] = useState<number|null>(null);
  const [activeMarkerPoint, setActiveMarkerPoint] = useState<LatLngLiteral|null>(null);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const tempOrderReducer = useAppSelector((state) => state.tempOrderReducer);
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerIcon = {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    fillColor: 'blue',
    fillOpacity: 1,
    scale: 10,
    strokeColor: 'white',
    strokeWeight: 2,
  };
  const markerWithOrderIcon = {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    fillColor: 'green',
    fillOpacity: 1,
    scale: 10,
    strokeColor: 'white',
    strokeWeight: 2,
  };
  
  const spotWithOrderIcon = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: 'green',
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 20),
  }
  
  // 取得所有有tempOrder的地標
  useEffect(() => {
    if(tempOrderReducer.orders){
      const tempOrderSpots = tempOrderReducer.orders.map((order) => order.spotId);
      const tempOrderIds = tempOrderReducer.orders.map((order) => order.orderId);
      setTotalDistance(directions && directions.reduce((accumulator, currentValue) => {
        if(currentValue.routes[0].legs[0].distance === undefined) return accumulator;
        return accumulator+currentValue.routes[0].legs[0].distance.value
      }, 0)/1000 || 0);
      setTotalDuration(directions && directions.reduce((accumulator, currentValue)=> {
        if(currentValue.routes[0].legs[0].duration === undefined) return accumulator;
        return accumulator+currentValue.routes[0].legs[0].duration.value
      }, 0)/60 || 0);
      
      console.log("DriverMap tempOrderSpots: ", tempOrderSpots);
      setTempOrders(tempOrderIds)
      setTempOrderSpots(tempOrderSpots);
    }
  }, [tempOrderReducer.orders, directions]);

  useEffect(() => {
    // 取得所有地標
    if(!showSpots) setSpots([]);
    async function fetchData(){
      // const nearLandMark = await getNearLandMark({lat: location.lat || 0, lng: location.lng || 0});
      if (driverDepart.departureTime === 0 || driverDepart.departureTime === undefined) {
        alert("請選擇出發時間")
        return;
      }
      const spots = await getSpots(driverDepart.departureTime, 1);
      setSpots(spots);
    }
    try {
      setCurrentCenter({lat: driverStartDestReducer.start.lat as number, lng: driverStartDestReducer.start.lng as number});
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [showSpots, driverStartDestReducer.start]);

  const defaultProps = {
    center: {
      lat: driverStartDestReducer.start.lat !== undefined ? driverStartDestReducer.start.lat : location.lat,
      lng: driverStartDestReducer.start.lng !== undefined ? driverStartDestReducer.start.lng : location.lng
    },
    zoom: 15
  };

  const handleActiveMarker = async (spotId: number, spotPoint?: LatLngLiteral) => {
    // 重新取得該地標的訂單
    setOrders && setOrders([]);
    if (driverDepart.departureTime === 0 || driverDepart.departureTime === undefined) {
      console.log("DriverMap: 請選擇出發時間")
      return;
    }
    // TODO: 依照目前的設計，該地標一定會有訂單，主要是訂單可能會被刪除或被其他司機收走，所以要再確認
    let orders = await getSpotOrders(spotId, driverDepart.departureTime);
    console.log("DriverMap 120: ", orders)
    // 取得地標附近的訂單，並傳給父層，讓PickupPanel顯示
    orders = orders.map((order) => {order.spotId = spotId; return order});
    if (setOrders) setOrders(orders);
    console.log("DriverMap: ", orders);

    setActiveMarker(spotId);
    setActiveMarkerPoint(spotPoint || null);
    // 將中心點移至地標
    if (spotPoint !== undefined) setCurrentCenter({lat: spotPoint.lat, lng: spotPoint.lng});
  };

  // 抓取地圖中心點
  const centerChangeHandler = () => {
    if(mapRef.current){
        // const center = mapRef.current?.getCenter();
        // console.log(center?.toJSON())
        // if(center!==null && center!==undefined){
        //   setCurrentCenter(center.toJSON());
        // }
    }
  }

  return <>
      <div className="h-[100%] w-full">
        {isLoaded && (
        <>
          {
            directions && (
              <div>
                <div className="absolute top-[5%] left-[5%] z-50 border border-amber-400 rounded-lg bg-white mr-4">
                  <div className="text-xs px-2 py-2 font-medium">
                    距離：{totalDistance.toFixed(2)}公里
                    <br />
                    時間：{(totalDuration/60).toFixed(0)}小時 {(totalDuration%60).toFixed(0)}分鐘
                  </div>
                </div>
              </div>
            )
          }
          <GoogleMap
            onLoad={(map) => {mapRef.current = map}}
            center={(currentCenter && currentCenter) || defaultProps.center as LatLngLiteral}
            zoom={defaultProps.zoom}
            onClick={() => {setActiveMarker(null)}}
            mapContainerStyle={{ height: "100%", width: "100%" }}
            onCenterChanged={centerChangeHandler}
            options={{
              mapId: "955417d2092c184d",
              disableDefaultUI: true,
              clickableIcons: false,
            }}
          >
            {directions &&
              (
                <>
                  {
                    directions.map((leg, index) => (
                      <React.Fragment key={index}>
                        <DirectionsRenderer
                          directions={leg}
                          options={{
                            polylineOptions: {
                              strokeColor: getColor(index),
                              strokeOpacity: 0.8,
                              strokeWeight: 10* (1/(index+1)),
                              zIndex: ((1/(index+1))*100),
                            },
                            markerOptions: {
                              // 全局標記設定，如果有特定 leg 的設定，會被覆蓋
                              icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                fillColor: getColor(index),
                                fillOpacity: 1,
                                strokeWeight: 0,
                                scale: 12
                              },
                              label: {
                                text: (index + 1).toString(),
                                color: "black",
                                fontSize: "12px",
                                fontWeight: "bold",
                              },
                              zIndex: ((1/(index+1))*100),
                            },
                          }}
                          routeIndex={0}
                        />
                      </React.Fragment>
                    ))
                  }
                </>
              )
            }
            {
              !driverStartDestReducer.start.name && (
                <MarkerF
                  position={defaultProps.center as LatLngLiteral}
                  label={"Here"}
                >
                </MarkerF>
              )
            }  
            {
              (driverStartDestReducer.start.name && (directions ? directions.length < 2 : true)) &&  (
                <MarkerF
                  position={{lat: driverStartDestReducer.start.lat, lng: driverStartDestReducer.start.lng} as LatLngLiteral }
                  label={"Start"}
                >
                </MarkerF>
              )
            }
            {
              (driverStartDestReducer.dest.name && (directions ? directions.length < 2 : true)) &&  (
                <MarkerF
                  position={{lat: driverStartDestReducer.dest.lat, lng: driverStartDestReducer.dest.lng} as LatLngLiteral }
                  label={"Dest"}
                >
                </MarkerF>
              )
            }
            {
              showSpots && (
                spots.map(({spot_id, name, point, order_count}) => {
                  if(tempOrderSpots.includes(spot_id)){
                    return (
                      <MarkerF
                        key={spot_id}
                        position={{lat: point.lat, lng: point.lng} as LatLngLiteral }
                        label={order_count.toString()+'人'}
                        title={name}
                        icon={spotWithOrderIcon}
                        onClick={()=>{handleActiveMarker(spot_id, point)}}
                      >
                        {
                          activeMarker === spot_id ? (
                            <InfoWindowF 
                              position={{lat: point.lat, lng: point.lng} as LatLngLiteral }
                              onCloseClick={() => {setActiveMarker(null)}}>
                              <div>{name}</div>
                            </InfoWindowF>
                          ) : null
                        }
                      </MarkerF>
                    )
                  }else{
                    return (
                      <MarkerF
                        key={spot_id}
                        position={{lat: point.lat, lng: point.lng} as LatLngLiteral }
                        label={order_count.toString()+'人'}
                        title={name}
                        onClick={()=>{handleActiveMarker(spot_id, point)}}
                      >
                        {
                          activeMarker === spot_id ? (
                            <InfoWindowF 
                              position={{lat: point.lat, lng: point.lng} as LatLngLiteral }
                              onCloseClick={() => {setActiveMarker(null)}}>
                              <div>{name}</div>
                            </InfoWindowF>
                          ) : null
                        }
                      </MarkerF>
                    )
                  }
                })
              )
            }
            {
              activeMarkerPoint && (
                <Circle center={activeMarkerPoint} radius={1000} options={closeOptions} />
              )
            }
            {
              showSpots && orders !== undefined && orders.length !== 0 && orders.map((order) => {
                return (
                  <MarkerF
                    key={order.orderId}
                    position={{lat: order.startPoint.lat, lng: order.startPoint.lng} as LatLngLiteral }
                    label={order.passengerCount.toString()+'人'}
                    title={order.startName}
                    icon={tempOrders.includes(order.orderId) ? markerWithOrderIcon : markerIcon}
                    onClick={()=>{setMarkerOrderId && setMarkerOrderId(order.orderId)}}
                  ></MarkerF>
                )
              })
            }
          </GoogleMap>
        </>
        )}
      </div>
  </>
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};

export default DriverMap;