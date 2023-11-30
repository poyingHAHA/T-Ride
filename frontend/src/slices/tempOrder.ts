import { createSlice } from "@reduxjs/toolkit";
import { orderDTO } from "../DTO/orders";

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
    addTempOrder: (state, action) => {
      if(state.orders.length===0){
        state.orders = [...state.orders, action.payload]
      }else{
        // 去掉重複的order
        state.orders = state.orders.filter(order => order.orderId !== action.payload.orderId)
        state.orders = [...state.orders, action.payload]
      }
    },
    removeTempOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.orderId !== action.payload.orderId)
    }
  }
})

export const { addTempOrder, removeTempOrder } = tempOrder.actions;
export default tempOrder.reducer;
  
