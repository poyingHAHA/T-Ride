import { createSlice } from "@reduxjs/toolkit";

interface driverDepartState {
  departureTime?: number
  passengerCount: number
  currentPassenger: number
}

const initialState: driverDepartState = {
  departureTime: Date.now(),
  passengerCount: 0 ,
  currentPassenger: 0
}

export const driverDepart = createSlice({
  name: 'driverStartDest',
  initialState,
  reducers: {
    setDepartureTime: (state, action) => {
      state.departureTime = action.payload
    },
    setPassengerCount: (state, action) => {
      state.passengerCount = action.payload
    },
    setCurrentPassenger: (state, action) => {
      state.currentPassenger = action.payload.currentPassenger
    }
  }
})

export const { setDepartureTime, setPassengerCount, setCurrentPassenger } = driverDepart.actions;
export default driverDepart.reducer;
  
