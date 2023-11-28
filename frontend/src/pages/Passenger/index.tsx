import React from 'react';
import PassengerNavbar from './components/PassengerNavBar';
import { Outlet } from 'react-router-dom';
import PassengerHistory from './pages/PassengerHistory';
import PassengerRoute from './pages/PassengerRoute';
import PassengerAccount from './pages/PassengerAccount';
import PassengerTripinfo from './pages/PassengerTripinfo';
import PassengerMain from './pages/PassengerMain';

const Passenger: React.FC = () => {
    return (
        <div>
            <div className='flex flex-col justify-between'>
                <Outlet />
                <div className='grow-0 absolute inset-x-0 bottom-0'>
                    <PassengerNavbar />
                </div>
            </div>
        </div >
    )
}

export { PassengerMain, PassengerRoute, PassengerHistory, PassengerAccount, PassengerTripinfo };
export default Passenger;