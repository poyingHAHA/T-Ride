import { createSlice } from "@reduxjs/toolkit";
import { orderDTO } from "../DTO/orders";
import { WritableDraft } from "immer/dist/internal";

interface tempOrderState {
  orders: orderDTO[]
}

const initialState: tempOrderState = {
  orders: []
}

export const tempOrder = createSlice({
  name: 'driverStartDest',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      // 去掉重複的order
      if(state.orders.length===0){
        state.orders = [...state.orders, ...action.payload.orders]
      }else{
        state.orders = state.orders.filter(order => order.orderId !== action.payload.orderId)
        state.orders = [...state.orders, ...action.payload]
      }
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.orderId !== action.payload.orderId)
    }
  }
})

export const { addOrder, removeOrder } = tempOrder.actions;
export default tempOrder.reducer;
  
