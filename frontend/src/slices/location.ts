import { createSlice } from "@reduxjs/toolkit";

interface locationState {
  lat?: number,
  lng?: number,
  timestamp?: number
}

const initialState: locationState = {
  lat: 25.0174525,
  lng: 121.545246,
  timestamp: undefined
}

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.lat = action.payload.lat
      state.lng = action.payload.lng
      state.timestamp = action.payload.timestamp
    },
    clearLocation: (state) => {
      state.lat = undefined
      state.lng = undefined
      state.timestamp = undefined
    }
  }
})

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
  
