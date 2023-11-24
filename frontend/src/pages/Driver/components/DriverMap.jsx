import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, DirectionsRenderer, InfoWindowF, OverlayView} from "@react-google-maps/api";
import AdvMarker from "./AdvancedMarker"
import { getNearLandMark } from "../../../services/nearLandMark";

// 測試用
const markers = [
  {
    id: 1,
    name: "A",
    position: {
      lat: 25.0174525,
      lng: 121.545246,
    }
  },
  {
    id: 2,
    name: "B",
    position: {
      lat: 25.0374525,
      lng: 121.565246,
    }
  },
  {
    id: 3,
    name: "C",
    position: {
      lat: 25.0024525,
      lng: 121.525246,
    }
  },
]

const DriverMap = ({isLoaded, directions}) => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const location = { ...locationReducer}
  const [activeMarker, setActiveMarker] = useState(null);
  const driverStartDestReducer = useAppSelector((state) => state.driverStartDestReducer);
  
  useEffect(() => {
    // 取得附近地標
    console.log("driverStartDestReducer: ", driverStartDestReducer)
    console.log("directions: ", directions)
    async function fetchData(){
      const nearLandMark = await getNearLandMark({lat: location.lat, lng: location.lng});
      console.log(nearLandMark);
    }
    // try {
    //   fetchData();
    // } catch (error) {
    //   console.log(error);
    // }
  }, [directions]);

  const defaultProps = {
    center: {
      lat: driverStartDestReducer.start.lat !== undefined ? driverStartDestReducer.start.lat : location.lat,
      lng: driverStartDestReducer.start.lng !== undefined ? driverStartDestReducer.start.lng : location.lng
    },
    zoom: 15
  };

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const overlayViewContainerStyle = {
    position: 'absolute',
    bottom: 20,
    right: 20,
    background: 'white',
    padding: 10,
    borderRadius: '5px',
  };

  const InfoOverlay = () => (
    <div style={overlayViewContainerStyle}>
      <p>Some Information</p>
      {/* 添加其他信息或组件 */}
    </div>
  );

  return <>
      <div className="h-screen w-full">
        {isLoaded && (
        <>
          {
            directions && (
              <div>
                <div className="absolute top-[80%] left-[70%] z-50 border border-amber-400 rounded-lg bg-white">
                  <div className="text-xs px-2 py-2 font-medium">
                    距離：{directions.routes[0].legs[0].distance.text}
                    <br />
                    時間：{directions.routes[0].legs[0].duration.text}
                  </div>
                </div>
              </div>
            )
          }
          <GoogleMap
            center={defaultProps.center}
            zoom={defaultProps.zoom}
            onClick={() => {setActiveMarker(null)}}
            mapContainerStyle={{ height: "100vh", width: "100%" }}
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
                  position={defaultProps.center}
                  label={"Here"}
                >
                </MarkerF>
              )
            }  
            {
              (driverStartDestReducer.start.name && !directions) &&  (
                <MarkerF
                  position={{lat: driverStartDestReducer.start.lat, lng: driverStartDestReducer.start.lng}}
                  label={"Start"}
                >
                </MarkerF>
              )
            }
            {
              (driverStartDestReducer.dest.name && !directions ) &&  (
                <MarkerF
                  position={{lat: driverStartDestReducer.dest.lat, lng: driverStartDestReducer.dest.lng}}
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