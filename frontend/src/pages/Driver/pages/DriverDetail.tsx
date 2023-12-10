import React, { useState, useEffect } from "react";
import DriverNavigate from "../components/DriverNavigate";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import DriverDetailCard from "../components/DriverDetailCard";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { getInvitationTotal  } from "../../../services/driveOrderService";
import { InfoItem, setJourney } from "../../../slices/driverJourney";
import ErrorLoading from '../../../components/ErrorLoading';

const libraries:Libraries = ["marker", "places"];

interface Middle {
  id: number;
  name: string;
  start: string;
  end: string;
  time: string; //starting time
  price: number;
  headcount: number;
};

const DriverDetail: React.FC =() => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
    version: "beta",
    libraries,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const order = location.state?.orderId;
  const [orderId, setOrderId] = useState(order);
  const [info, setInfo] = useState<Middle[]>([]);
  const [isLoad, setIsLoad] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); //ErrorLoading
  const [error, setError] = useState<string>("");
  const driverJourneyReducer = useAppSelector((state) => state.driverJourneyReducer);

  useEffect(() => {
    async function fetchMiddle() {    
      // setLoading(true);
      // const middle: InfoItem[] = await getInvitationTotal(orderId) as InfoItem[];
      // setLoading(false);
      // dispatch(setJourney(middle));
      const Infos: Middle[] = driverJourneyReducer.Midpoints.map((item) => {
        return {
          id: item.userId,
          name: item.userName,
          headcount: item.passengerCount,
          price: item.fee,
          start: item.startName,
          end: item.endName,
          time: item.pickTime
          };
      });
      setInfo(Infos);
      setIsLoad(true);
    }
    fetchMiddle();
  }, [isLoad]);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="h-full w-screen">
      <div className="h-[calc(100vh-386px)]">
        <div className="h-full overflow-hidden">
          <DriverNavigate />
        </div>
      </div>
      <div className="bg-white w-full h-[260px] rounded-t-[30px] bottom-[80px] absolute z-1 overflow-auto pt-[20px]">
        <div className="flex flex-col p-[30px] gap-[30px]">
          {info.map((passenger:Middle) => {
            return(<DriverDetailCard key={passenger.id} {...passenger}/>);
          })}
        </div>
      </div>
      <div className="bg-white w-full h-[70px] fixed bottom-[70px] z-2 flex justify-center items-center">
        <button 
          className="w-[calc(100%-30px)] h-[50px] bg-black rounded-[10px] text-white text-[24px]"
          onClick={() => {
            navigate('/driver/trip', {state: {orderId: orderId}})
          }}
          >返回</button>
      </div>
      <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} />
    </div>
  );
}

export default DriverDetail;