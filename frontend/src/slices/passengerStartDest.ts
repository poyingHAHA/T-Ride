import { createSlice } from "@reduxjs/toolkit";

interface passengerStartDestState {
  start: {
    name?: string,
    placeId?: string,
    lat?: number,
    lng?: number
  },
  dest: {
    name?: string,
    placeId?: string,
    lat?: number,
    lng?: number
  }
}

const initialState: passengerStartDestState = {
  start: {
    name: undefined,
    placeId: undefined,
    lat: undefined,
    lng: undefined
  },
  dest: {
    name: undefined,
    placeId: undefined,
    lat: undefined,
    lng: undefined
  }
}

export const passengerStartDest = createSlice({
  name: 'passengerStartDest',
  initialState,
  reducers: {
    setStart: (state, action) => {
      state.start.name = action.payload.name
      state.start.placeId = action.payload.placeId
      state.start.lat = action.payload.lat
      state.start.lng = action.payload.lng
    },
    setDest: (state, action) => {
      state.dest.name = action.payload.name
      state.dest.placeId = action.payload.placeId
      state.dest.lat = action.payload.lat
      state.dest.lng = action.payload.lng
    },
    resetStart: (state) => {
      state.start = {
        name: undefined,
        placeId: undefined,
        lat: undefined,
        lng: undefined
      };
    },
    resetDest: (state) => {
      state.dest = {
        name: undefined,
        placeId: undefined,
        lat: undefined,
        lng: undefined
      };
    },
  }
})

export const { setStart, setDest, resetStart, resetDest } = passengerStartDest.actions;
export default passengerStartDest.reducer;

