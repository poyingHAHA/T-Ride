import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error"
import Driver, { DriverMain, DriverRoute, DriverHistory, DriverSetting, DriverInfo, DriverTrip, DriverPickup } from "./pages/Driver";
import Passenger, { PassengerMain, PassengerRoute, PassengerHistory, PassengerAccount, PassengerTripinfo } from "./pages/Passenger";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import DriverRegister from "./pages/DriverRegister";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/driver",
    element: <Driver />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DriverMain />
      },
      {
        path: "pickup",
        element: <DriverPickup />
      },
      {
        path: "route",
        element: <DriverRoute />
      },
      {
        path: "history",
        element: <DriverHistory />
      },
      {
        path: "setting",
        element: <DriverSetting />
      },
      {
        path: "info",
        element: <DriverInfo />
      },
      {
        path: "trip",
        element: <DriverTrip />
      },
    ]
  },
  {
    path: "/passenger",
    element: <Passenger />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <PassengerMain />
      },
      {
        path: "route",
        element: <PassengerRoute />
      },
      {
        path: "history",
        element: <PassengerHistory />
      },
      {
        path: "account",
        element: <PassengerAccount />
      },
      {
        path: "tripinfo",
        element: <PassengerTripinfo />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/selectRole",
    element: <SelectRole />,
  },
  {
    path: "/driverRegister",
    element: <DriverRegister />
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);

export default router;