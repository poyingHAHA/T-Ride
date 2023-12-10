import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoStarSharp } from "react-icons/io5";
import DriverTripCard from "../components/DriverTripCard";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { getStartEnd, getInvitationTotal  } from "../../../services/driveOrderService";
import { StartEnd, InfoItem, setStartEnd, setJourney } from "../../../slices/driverJourney";
import ErrorLoading from '../../../components/ErrorLoading';


interface TripItem {
  type: string;
  name: string;
  time: string;
}

const DriverTrip: React.FC =() => {

  //Todo:抓orderId

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const order = location.state?.orderId;
  const driverJourneyReducer = useAppSelector((state) => state.driverJourneyReducer);
  const [orderId, setOrderId] = useState(order);
  const [trip, setTrip] = useState<TripItem[]>([]);
  const [isLoad, setIsLoad] = useState(false);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState<boolean>(false); //ErrorLoading
  const [error, setError] = useState<string>("");

  //navigation
  const handleNavigate = () => {
    const start = [driverJourneyReducer.StartPoint.place.lat, driverJourneyReducer.StartPoint.place.lng]
    const mid = driverJourneyReducer.Midpoints.map((mid) => {
      const location = [mid.startPlace.lat, mid.startPlace.lng];
      return location;
    });
    const end = [driverJourneyReducer.EndPoint.place.lat, driverJourneyReducer.EndPoint.place.lng]
    const coordinates = [start, ...mid, end];

    const origin = coordinates[0];
    const waypoints = coordinates.slice(1);
    const baseUrl = "https://www.google.com/maps/dir/";
    const urlEnd = `/@${origin},16z/`; 
    // /data=!4m2!4m1!3e0?authuser=0&entry=ttu
    // /data=!3m1!4b1?entry=ttu
    const waypointsString = waypoints.map(coord => coord.join(',')).join('/');
    const externalURL = `${baseUrl}${origin}/${waypointsString}${urlEnd}`;
    window.location.href = externalURL;
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        // setLoading(true);
        // const middle: InfoItem[] = await getInvitationTotal(orderId) as InfoItem[];
        // setLoading(false);
        // dispatch(setJourney(middle));
        const mappedPlaces = driverJourneyReducer.Midpoints.flatMap((mid) => [
          {
            type: "中途經過",
            name: mid.startName,
            time: mid.pickTime,
          },
          {
            type: "中途經過",
            name: mid.endName,
            time: mid.arriveTime,
          }
        ]);

        // Sorting based on time
        mappedPlaces.sort((a:TripItem, b:TripItem) => {
          const timeA:any = new Date("1970-01-01T" + a.time);  
          const timeB:any = new Date("1970-01-01T" + b.time);
          return timeA - timeB;  
        });

        // setLoading(true);
        // const StartEnd: StartEnd[] = await getStartEnd(orderId) as StartEnd[];
        // setLoading(false);
        // dispatch(setStartEnd(StartEnd));
        const start = { 
          type: "起點", 
          name: driverJourneyReducer.StartPoint.name, 
          time: driverJourneyReducer.StartPoint.time, 
        };
        setDate(driverJourneyReducer.StartPoint.date );
        const end = { 
          type: "終點", 
          name: driverJourneyReducer.EndPoint.name, 
          time: driverJourneyReducer.EndPoint.time, 
        };
        setTrip([start, ...mappedPlaces, end]);
        setIsLoad(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError("發生錯誤");
      }
    }
    fetchAll();
  }, [isLoad]);


  return (
    <div className="bg-[#ededed] m-0 h-full w-screen">
      <div className="text-center w-screen fixed top-[60px] font-bold text-[36px] font-serif">行程資訊</div>
      <div className="text-center w-screen fixed top-[120px] font-normal text-[18px] font-sans">{date}</div>
      <div className="flex flex-col items-center rounded-t-[30px] bg-white w-screen h-[calc(100vh-320px)] fixed bottom-[150px] overflow-auto pt-[40px] pb-[40px] gap-[30px]">
        {trip.map((place, index) => {
          return (<DriverTripCard key={index} {...place} />);
        })}
      </div>
      <div className="bg-white flex flex-row justify-evenly items-center w-screen h-[100px] fixed bottom-[70px]">
          <button
            className="w-[60px] h-[60px] bg-black rounded-[10px] flex justify-evenly items-center"
            onClick={() => {
              navigate("/driver/detail", {state: {orderId: orderId}})
            }}>
            <IoIosInformationCircleOutline className="w-[40px] h-[40px] text-white"/>
          </button>
          <button
            className="w-[150px] h-[60px] bg-black rounded-[10px] flex justify-evenly items-center"
            onClick={() => {
              handleNavigate();
            }}>
            <span className="text-[24px] text-white">導航</span>
          </button>
          <button 
            className="w-[60px] h-[60px] rounded-[10px] bg-black flex justify-evenly items-center rounded-[10px]"
            onClick={() => {
              navigate("/driver/rating", {state: {orderId: orderId}})
            }}>
              <IoStarSharp className="w-[30px] h-[30px] text-white"/>
            </button>
      </div>
      <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} />
    </div>
  );
}

export default DriverTrip;