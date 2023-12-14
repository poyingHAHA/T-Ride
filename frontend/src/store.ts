import { configureStore, createAction } from "@reduxjs/toolkit";
import loginReducer from "./slices/login";
import locationReducer from "./slices/location";
import { combineReducers } from "redux";
import driverStartDestReducer from "./slices/driverStartDest";
import passengerStartDestReducer from "./slices/passengerStartDest";
import driverDepartReducer from "./slices/driverDepart";
import passengerDepartReducer from "./slices/passengerDepart";
import tempOrderReducer from "./slices/tempOrder";
import driverJourneyReducer from "./slices/driverJourney";
import waypointReducer from "./slices/waypoint";

const resetState = createAction("RESET_STATE");

const reducers = combineReducers({
  loginReducer,
  locationReducer,
  driverStartDestReducer,
  passengerStartDestReducer,
  driverDepartReducer,
  passengerDepartReducer,
  tempOrderReducer,
  driverJourneyReducer,
  waypointReducer
})

const rootReducer = (state: any, action: any) => {
  if (action.type === resetState.type) {
    state = undefined
  }
  return reducers(state, action)
}


const store = configureStore({
  reducer: rootReducer,
})

export {resetState};

// RootState是一個type，可以從store中取得state
export type RootState = ReturnType<typeof rootReducer>

// AppDispatch是一個type，可以取得dispatch function
// dispatch function 是store提供的一個function，可以dispatch一個action
export type AppDispatch = typeof store.dispatch

// store 的作用是儲存state，並且提供一個dispatch function，可以dispatch一個action
// 當dispatch一個action時，會觸發reducer，並回傳一個新的state
// 要使用store，必須先將store傳入Provider中
// Provider是react-redux提供的一個component，可以將store傳入，並且將store儲存在context中
export default store