import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error"
import Driver, { DriverMain, DriverRoute, DriverHistory, DriverSetting } from "./pages/Driver";
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
        path: "route",
        element: <DriverRoute />
      },
      {
        path: "history",
        element: <DriverHistory/>
      },
      {
        path: "setting",
        element: <DriverSetting />
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