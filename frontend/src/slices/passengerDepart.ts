import { createSlice } from "@reduxjs/toolkit";

interface passengerDepartState {
  departureTime1?: number
  departureTime2?: number
  passengerCount?: number
}

const initialState: passengerDepartState = {
  departureTime1: Date.now(),
  departureTime2: Date.now(),
  passengerCount: 1
}

export const passengerDepart = createSlice({
  name: 'passengerStartDest',
  initialState,
  reducers: {
    setDepartureTime1: (state, action) => {
      state.departureTime1 = action.payload
    },
    setDepartureTime2: (state, action) => {
      state.departureTime2 = action.payload
    },
    setPassengerCount: (state, action) => {
      state.passengerCount = action.payload
    }
  }
})

export const { setDepartureTime1, setDepartureTime2, setPassengerCount } = passengerDepart.actions;
export default passengerDepart.reducer;

