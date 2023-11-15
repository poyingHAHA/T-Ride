import { createSlice } from "@reduxjs/toolkit";

interface locationState {
  latitude?: number,
  longitude?: number,
  timestamp?: number
}

const initialState: locationState = {
  latitude: undefined,
  longitude: undefined,
  timestamp: undefined
}

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
      state.timestamp = action.payload.timestamp
    },
    clearLocation: (state) => {
      state.latitude = undefined
      state.longitude = undefined
      state.timestamp = undefined
    }
  }
})

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
  
