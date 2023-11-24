import React, { useEffect } from 'react';
import DriverNavbar from './components/DriverNavbar';
import { Outlet } from 'react-router-dom';
import DriverHistory from './pages/DriverHistory';
import DriverMain from './pages/DriverMain';
import DriverRoute from './pages/DriverRoute';
import DriverSetting from './pages/DriverSetting';
import DriverInfo from './pages/DriverInfo';
import DriverTrip from './pages/DriverTrip';
import DriverPickup from './pages/DriverPickup';
import DriverDetail from './pages/DriverDetail';
import DriverContact from './pages/DriverContact';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setLocation } from '../../slices/location';

const Driver: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // 取得使用者位置
  useEffect(() => {
    const id = navigator.geolocation.watchPosition((position) => {
      console.log("Index: ", position)
      const { latitude, longitude } = position.coords;
      const timestamp = position.timestamp;
      dispatch(setLocation({ lat: latitude, lng: longitude, timestamp }));
    }, (error) => {
      console.log("Index: ", error)
    })

    return () => {
      navigator.geolocation.clearWatch(id)
    }
  }, [])

  return <>
    <div className='flex flex-col justify-between'>
      <Outlet />
      <div className='grow-0 absolute inset-x-0 bottom-0'>
        <DriverNavbar />
      </div>
    </div>
  </>
}

export { DriverMain, DriverRoute, DriverHistory, DriverSetting, DriverInfo, DriverTrip, DriverDetail, DriverContact, DriverPickup};
export default Driver;