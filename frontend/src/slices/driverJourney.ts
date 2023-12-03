import { createSlice } from "@reduxjs/toolkit";

export interface InfoItem {
  userId: number;
  userName: string;
  startName: string;
  endName: string;
  pickTime: string;
  arriveTime: string;
  state: boolean;
  startPlace: {
    lat: number,
    lng: number
  },
  endPlace: {
    lat: number,
    lng: number
  },
  fee: number,
  passengerCount: number
}

export interface StartEnd {
  name: string,
  time: string,
  place: {
    lat: number,
    lng: number
  }
}

interface InfoState {
  Midpoints: InfoItem[],
  StartPoint: StartEnd,
  EndPoint: StartEnd
}

const initialState: InfoState = {
  Midpoints: [],
  StartPoint: {name: "", time: "", place: {lat: 0, lng: 0}},
  EndPoint: {name: "", time: "", place: {lat: 0, lng: 0}}
}

export const driverJourney = createSlice({
  name: 'driverJourney',
  initialState,
  reducers: {
    setJourney: (state, action) => {
      state.Midpoints = action.payload;
    },
    setStartEnd: (state, action) => {
      state.StartPoint = action.payload[0];
      state.EndPoint = action.payload[1];
    }
  }
});

export const { setJourney, setStartEnd } = driverJourney.actions;
export default driverJourney.reducer;