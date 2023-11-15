import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/login";
import locationReducer from "./slices/location";
import { combineReducers } from "redux";

const reducers = combineReducers({
  loginReducer,
  locationReducer
})

const store = configureStore({
  reducer: reducers,
})

// RootState是一個type，可以從store中取得state
export type RootState = ReturnType<typeof reducers>

// AppDispatch是一個type，可以取得dispatch function
// dispatch function 是store提供的一個function，可以dispatch一個action
export type AppDispatch = typeof store.dispatch

// store 的作用是儲存state，並且提供一個dispatch function，可以dispatch一個action
// 當dispatch一個action時，會觸發reducer，並回傳一個新的state
// 要使用store，必須先將store傳入Provider中
// Provider是react-redux提供的一個component，可以將store傳入，並且將store儲存在context中
export default store