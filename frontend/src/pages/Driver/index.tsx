import React, { useEffect } from 'react';
import DriverNavbar from './components/DriverNavbar';
import { Outlet } from 'react-router-dom';
import DriverHistory from './pages/DriverHistory';
import DriverMain from './pages/DriverMain';
import DriverRoute from './pages/DriverRoute';
import DriverSetting from './pages/DriverSetting';
import DriverInfo from './pages/DriverInfo';
import DriverTrip from './pages/DriverTrip';
import DriverDetail from './pages/DriverDetail';
import DriverRating from './pages/DriverRating';
import DriverHistoryRecord from './pages/DriverHistoryRecord';
import { useAppDispatch } from '../../hooks';
import { setLocation } from '../../slices/location';
import DriverAccount from './pages/DriverAccount';

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
    <div className='relative flex flex-col justify-between'>
      <div className='h-[90vh]'>
        <Outlet />
      </div>
      <div className='fixed grow-0 inset-x-0 bottom-0 h-[10vh]'>
        <DriverNavbar />
      </div>
    </div>
  </>
}

export { DriverMain, DriverRoute, DriverHistory, DriverSetting, DriverInfo, DriverTrip, DriverDetail, DriverRating, DriverAccount, DriverHistoryRecord };
export default Driver;