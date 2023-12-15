import { createSlice } from "@reduxjs/toolkit";
import { WaypointDTO } from "../DTO/waypoint";
import { stat } from "fs";

interface waypointState {
  waypoints: WaypointDTO[]
}

const initialState: waypointState = {
  waypoints: []
}

export const waypoint = createSlice({
  name: 'driverStartDest',
  initialState,
  reducers: {
    addWaypoint: (state, action) => {
      if(state.waypoints.length===0){
        state.waypoints = [...state.waypoints, action.payload]
      }else{
        // 去掉重複的waypoint
        state.waypoints = state.waypoints.filter(order => !(order.orderId === action.payload.orderId && order.pointType === action.payload.pointType))
        state.waypoints.splice(state.waypoints.length-1, 0, action.payload)
      }
    },
    removeWaypoint: (state, action) => {
      state.waypoints = state.waypoints.filter(order => order.orderId !== action.payload.orderId)
    },
    setWaypoint: (state, action) => {
      state.waypoints = action.payload
    }
  }
})

export const { addWaypoint, removeWaypoint, setWaypoint } = waypoint.actions;
export default waypoint.reducer;
  
