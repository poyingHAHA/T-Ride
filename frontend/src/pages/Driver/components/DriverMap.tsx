import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";

const DriverMap: React.FC = () => {
  const locationReducer = useAppSelector((state) => state.locationReducer);
  const location = { ...locationReducer}

  return <>
    <div className="bg-gray-200 flex justify-center items-center h-full">
      {location.timestamp}
      <br/>
      {location.latitude}, {location.longitude}
    </div>
  </>
}

export default DriverMap;