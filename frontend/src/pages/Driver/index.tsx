import React from 'react';
import DriverNavbar from './components/DriverNavbar';
import { Outlet } from 'react-router-dom';
import DriverHistory from './pages/DriverHistory';
import DriverMain from './pages/DriverMain';
import DriverRoute from './pages/DriverRoute';
import DriverSetting from './pages/DriverSetting';

const Driver: React.FC = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
  }, (error) => {
    console.log(error);
  })

  return <>
    <div className='flex flex-col justify-between'>
      <Outlet />
      <div className='grow-0 absolute inset-x-0 bottom-0'>
        <DriverNavbar />
      </div>
    </div>
  </>
}

export { DriverMain, DriverRoute, DriverHistory, DriverSetting };
export default Driver;