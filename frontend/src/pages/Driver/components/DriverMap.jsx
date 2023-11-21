import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, InfoWindowF, OverlayView } from "@react-google-maps/api";
import AdvMarker from "./AdvancedMarker"
import { getNearLandMark } from "../../../services/nearLandMark";

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

const DriverMap = ({isLoaded}) => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const location = { ...locationReducer}
  const [activeMarker, setActiveMarker] = useState(null);
  
  useEffect(() => {
    // 取得附近地標
    async function fetchData(){
      const nearLandMark = await getNearLandMark({lat: location.lat, lng: location.lng});
      console.log(nearLandMark);
    }
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const defaultProps = {
    center: {
      lat: location.lat,
      lng: location.lng
    },
    zoom: 15
  };

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  }


  return <>
      <div className="h-screen w-full">
        {isLoaded && (
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
            
            {/* if(mapRef.current) {
              console.log(mapRef.current)
            } */}
            
            {/* <AdvMarker
              position={defaultProps.center}
              zIndex={100}
              // onClick={()=>{setTest(42)}}
            >
              <div 
                className="border-solid border-black h-5 w-6 text-white bg-black" 
                onMouseEnter={() => {setTest(42)}}
              >
                {test}
              </div>
            </AdvMarker> */}

            <MarkerF
              position={defaultProps.center}
              label={"Here"}
            >

            </MarkerF>

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
        )}
      </div>
  </>
}

export default DriverMap;