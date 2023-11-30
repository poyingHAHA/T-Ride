import { createSlice } from "@reduxjs/toolkit";

interface passengerDepartState {
  departureTime?: number
  passengerCount?: number
}

const initialState: passengerDepartState = {
  departureTime: Date.now(),
  passengerCount: 1
}

export const passengerDepart = createSlice({
  name: 'passengerStartDest',
  initialState,
  reducers: {
    setDepartureTime: (state, action) => {
      state.departureTime = action.payload
    },
    setPassengerCount: (state, action) => {
      state.passengerCount = action.payload
    }
  }
})

export const { setDepartureTime, setPassengerCount } = passengerDepart.actions;
export default passengerDepart.reducer;

