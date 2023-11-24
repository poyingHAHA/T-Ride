import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, DirectionsRenderer, InfoWindowF, OverlayView} from "@react-google-maps/api";
import AdvMarker from "./AdvancedMarker"
import { getNearLandMark } from "../../../services/nearLandMark";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type DriverMapProps = {
  isLoaded: boolean;
  directions?: DirectionsResult;
};

const DriverMap = ({isLoaded, directions}: DriverMapProps) => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const [currentCenter, setCurrentCenter] = useState<LatLngLiteral>({lat: locationReducer.lat || 0, lng: locationReducer.lng || 0});
  const location = { ...locationReducer}
  const [activeMarker, setActiveMarker] = useState(null);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // 取得附近地標
    async function fetchData(){
      const nearLandMark = await getNearLandMark({lat: location.lat || 0, lng: location.lng || 0});
      console.log(nearLandMark);
    }
    // try {
    //   fetchData();
    // } catch (error) {
    //   console.log(error);
    // }
  }, []);

  const defaultProps = {
    center: {
      lat: driverStartDestReducer.start.lat !== undefined ? driverStartDestReducer.start.lat : location.lat,
      lng: driverStartDestReducer.start.lng !== undefined ? driverStartDestReducer.start.lng : location.lng
    },
    zoom: 15
  };

  const handleActiveMarker = (marker: React.SetStateAction<null>) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
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
      <div className="h-screen w-full">
        {isLoaded && (
        <>
          {
            directions && (
              <div>
                <div className="absolute top-[80%] left-[70%] z-50 border border-amber-400 rounded-lg bg-white">
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
            center={defaultProps.center as LatLngLiteral}
            zoom={defaultProps.zoom}
            onClick={() => {setActiveMarker(null)}}
            mapContainerStyle={{ height: "100vh", width: "100%" }}
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
                  <DirectionsRenderer directions={directions} options={{
                    polylineOptions: {
                      // zIndex: 50,
                      strokeColor: "#1976D2",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }
                  }} />
                  {/* <OverlayView
                    position={{lat: defaultProps.center.lat, lng: defaultProps.center.lng}}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    zIndex={100}
                  >
                    <InfoOverlay />
                  </OverlayView> */}
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
            
            {/* {
              markers.map(({id, name, position}) => {
                return (
                <MarkerF
                  key={id} 
                  position={position} 
                  onClick={() => {handleActiveMarker(id)}}
                  label={"label"}
                  title={"title"}
                > 
                  {activeMarker === id ? (
                      <InfoWindowF onCloseClick={() => {setActiveMarker(null)}}>
                        <div>{name}</div>
                      </InfoWindowF>
                    ) : null}
                </MarkerF>
                )
              })
            } */}
          </GoogleMap>
        </>
        )}
      </div>
  </>
}

export default DriverMap;