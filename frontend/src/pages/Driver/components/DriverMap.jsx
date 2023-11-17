import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";
import GoogleMapReact from 'google-map-react';

const DriverMap = () => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const location = { ...locationReducer}
  console.log(location)
  const defaultProps = {
    center: {
      lat: location.latitude,
      lng: location.longitude
    },
    zoom: 15
  };

  // useEffect(() => {
  //   defaultProps.center.lat = location.latitude
  //   defaultProps.center.lng = location.longitude
  // }, [location])


  return <>
    <div className="bg-gray-200 flex justify-center items-center h-full">
      <div className="h-screen w-full">
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLEMAP_API_KEY || "" }}
          center={ defaultProps.center }
          defaultZoom={defaultProps.zoom}
        >
        </GoogleMapReact>
      </div>
    </div>
  </>
}

export default DriverMap;