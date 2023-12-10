import { createSlice } from "@reduxjs/toolkit";

interface driverStartDestState {
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
  },
  order: {
    orderId?: number,
  }
}

const initialState: driverStartDestState = {
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
  },
  order: {
    orderId: undefined
  }
}

export const driverStartDest = createSlice({
  name: 'driverStartDest',
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
    setOrderId: (state, action) => {
      state.order.orderId = action.payload.orderId
    }
  }
})

export const { setStart, setDest, setOrderId } = driverStartDest.actions;
export default driverStartDest.reducer;
  
