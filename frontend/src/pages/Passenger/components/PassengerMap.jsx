import React from "react";
import { useAppSelector } from "../../../hooks";
import { GoogleMap, MarkerF, InfoWindowF, OverlayView } from "@react-google-maps/api";
import { useState, useRef, useEffect } from 'react'
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

const PassengerMap = ({ isLoaded }) => {
    const locationReducer = useAppSelector((state) => state.locationReducer);
    const location = { ...locationReducer }
    const [activeMarker, setActiveMarker] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            // setUserCenter({ lat: latitude, lng: longitude });
        });
    }, [])

    // const options = useMemo < google.maps.MapOptions > (() => ({
    //     mapId: "d7d7b1b4a6aea68" || "",
    //     disableDefaultUI: true,
    //     clickableIcons: false,
    // }), [])

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
        <div>
            {isLoaded && (
                <GoogleMap
                    // center={defaultProps.center}
                    center={{ lat: 25.0476133, lng: 121.5174062 }}
                    zoom={defaultProps.zoom}
                    onClick={() => { setActiveMarker(null) }}
                    // mapContainerStyle={{ height: "100vh", width: "100%" }}
                    mapContainerClassName='w-full h-full'
                    options={{
                        mapId: "d7d7b1b4a6aea68" || "",
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

export default PassengerMap;