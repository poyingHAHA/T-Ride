import { createSlice } from "@reduxjs/toolkit";

interface locationState {
  lat: number | null,
  lng: number | null,
  id: number | null
}

const initialState: locationState = {
  lat: null,
  lng: null,
  id: null 
}

export const currentLocationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrLocation: (state, action) => {
      state.lat = action.payload.lat
      state.lng = action.payload.lng
    },
    setId: (state, action) => {
      state.id = action.payload
    },
    clearId: (state) => {
      navigator.geolocation.clearWatch(state.id as number);
    }
  }
})

export const { setCurrLocation, setId, clearId } = currentLocationSlice.actions;
export default currentLocationSlice.reducer;
  
