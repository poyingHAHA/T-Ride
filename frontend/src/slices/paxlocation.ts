import { createSlice } from "@reduxjs/toolkit";

interface paxlocationState {
  lat?: number,
  lng?: number,
  timestamp?: number
}

const initialState: paxlocationState = {
  lat: undefined,
  lng: undefined,
  timestamp: undefined
}

export const paxlocationSlice = createSlice({
  name: 'paxlocation',
  initialState,
  reducers: {
    setpaxLocation: (state, action) => {
      state.lat = action.payload.latitude
      state.lng = action.payload.longitude
      state.timestamp = action.payload.timestamp
    },
    clearpaxLocation: (state) => {
      state.lat = undefined
      state.lng = undefined
      state.timestamp = undefined
    }
  }
})

export const { setpaxLocation, clearpaxLocation } = paxlocationSlice.actions;
export default paxlocationSlice.reducer;
  
