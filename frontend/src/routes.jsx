import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error"
import DriverMain from "./pages/DriverMain";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import DriverRegister from "./pages/DriverRegister";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/driver",
    element: <DriverMain />,
    errorElement: <ErrorPage />
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