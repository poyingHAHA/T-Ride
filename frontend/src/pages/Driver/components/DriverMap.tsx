import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, DirectionsRenderer, InfoWindowF, OverlayView, Marker, Circle} from "@react-google-maps/api";
import AdvMarker from "./AdvancedMarker"
import { getSpots, getSpotOrders } from "../../../services/orderService";
import { orderDTO } from "../../../DTO/orders";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type DriverMapProps = {
  isLoaded: boolean;
  showSpots?: boolean;
  directions?: DirectionsResult;
  setOrders?: (orders: orderDTO[]) => void;
  orders?: orderDTO[];
  setMarkerOrderId?: (orderId: number) => void
};
type spot = {
  "spotId": string
  "spotName": string,
  "spotPoint": {
    "lng": number,
    "lat": number
  },
  "passengerCount": number
};

const DriverMap = ({isLoaded, directions, showSpots, setOrders, orders, setMarkerOrderId}: DriverMapProps) => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const [currentCenter, setCurrentCenter] = useState<LatLngLiteral>({lat: locationReducer.lat || 0, lng: locationReducer.lng || 0});
  const location = { ...locationReducer}
  const [spots, setSpots] = useState<spot[]>([]);
  const [activeMarker, setActiveMarker] = useState<string|null>(null);
  const [activeMarkerPoint, setActiveMarkerPoint] = useState<LatLngLiteral|null>(null);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const driverDepart = useAppSelector((state) => state.driverDepartReducer);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerIcon = {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    fillColor: 'blue',
    fillOpacity: 1,
    scale: 10,
    strokeColor: 'white',
    strokeWeight: 2,
  };

  useEffect(() => {
    // 取得所有地標
    if(!showSpots) setSpots([]);
    async function fetchData(){
      // const nearLandMark = await getNearLandMark({lat: location.lat || 0, lng: location.lng || 0});
      const spots = await getSpots(Date.now());
      setSpots(spots.spots);
      console.log("DriverMap Spots: ", spots);
    }
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [showSpots]);

  const defaultProps = {
    center: {
      lat: driverStartDestReducer.start.lat !== undefined ? driverStartDestReducer.start.lat : location.lat,
      lng: driverStartDestReducer.start.lng !== undefined ? driverStartDestReducer.start.lng : location.lng
    },
    zoom: 15
  };

  const handleActiveMarker = async (spotId: string, spotPoint?: LatLngLiteral) => {
    if (spotId === activeMarker) {
      return;
    }
    if (driverDepart.departureTime === 0 || driverDepart.departureTime === undefined) {
      console.log("DriverMap: 請選擇出發時間")
      return;
    }
    // TODO: 依照目前的設計，該地標一定會有訂單，主要是訂單可能會被刪除或被其他司機收走，所以要再確認
    const orders = await getSpotOrders(spotId, driverDepart.departureTime);
    // 取得地標附近的訂單，並傳給父層，讓PickupPanel顯示
    if (setOrders) setOrders(orders.orders);
    console.log("DriverMap: ", orders);

    setActiveMarker(spotId);
    setActiveMarkerPoint(spotPoint || null);
    // 將中心點移至地標
    if (spotPoint !== undefined) setCurrentCenter({lat: spotPoint.lat, lng: spotPoint.lng});
  };

  // 抓取地圖中心點
  const centerChangeHandler = () => {
    if(mapRef.current){
        const center = mapRef.current?.getCenter();
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
                <div className="absolute top-[45%] left-[65%] z-50 border border-amber-400 rounded-lg bg-white mr-4">
                  <div className="text-xs px-2 py-2 font-medium">
                    距離：{directions.routes[0].legs[0].distance && directions.routes[0].legs[0].distance.text}
                    <br />
                    時間：{directions.routes[0].legs[0].duration && directions.routes[0].legs[0].duration.text}
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
                  <DirectionsRenderer 
                    directions={directions} 
                    options={{
                      polylineOptions: {
                        // zIndex: 50,
                        strokeColor: "#1976D2",
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                      }
                  }} />
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
              (driverStartDestReducer.start.name && !directions) &&  (
                <MarkerF
                  position={{lat: driverStartDestReducer.start.lat, lng: driverStartDestReducer.start.lng} as LatLngLiteral }
                  label={"Start"}
                >
                </MarkerF>
              )
            }
            {
              (driverStartDestReducer.dest.name && !directions ) &&  (
                <MarkerF
                  position={{lat: driverStartDestReducer.dest.lat, lng: driverStartDestReducer.dest.lng} as LatLngLiteral }
                  label={"Dest"}
                >
                </MarkerF>
              )
            }
            {
              showSpots && (
                spots.map(({spotId, spotName, spotPoint, passengerCount}) => {
                  return (
                    <MarkerF
                      key={spotId}
                      position={{lat: spotPoint.lat, lng: spotPoint.lng} as LatLngLiteral }
                      label={passengerCount.toString()+'人'}
                      title={spotName}
                      onClick={()=>{handleActiveMarker(spotId, spotPoint)}}
                    >
                      {
                        activeMarker === spotId ? (
                          <InfoWindowF 
                            position={{lat: spotPoint.lat, lng: spotPoint.lng} as LatLngLiteral }
                            onCloseClick={() => {setActiveMarker(null)}}>
                            <div>{spotName}</div>
                          </InfoWindowF>
                        ) : null
                      }
                    </MarkerF>
                  )
                })
              )
            }
            {
              activeMarkerPoint && (
                <Circle center={activeMarkerPoint} radius={1000} options={closeOptions} />
              )
            }
            {
              orders !== undefined && orders.length !== 0 && orders.map((order) => {
                return (
                  <MarkerF
                    key={order.orderId}
                    position={{lat: order.startPoint.lat, lng: order.startPoint.lng} as LatLngLiteral }
                    label={order.userId.toString()}
                    title={order.startName}
                    icon={markerIcon}
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