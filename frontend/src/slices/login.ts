import { createSlice } from "@reduxjs/toolkit";

interface loginState {
  loginStatus: boolean
}

const initialState: loginState = {
  loginStatus: false
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    // 1. state: 當下的state, 
    // 2. action: 傳入的action(action 中包含type和payload, type跟payload是自動生成的，type是action的名稱，payload是傳入的參數)
    login: (state, action) => {
      state.loginStatus = true
    },
    logout: (state) => {
      state.loginStatus = false
    }
  }
})

// export action creator, action creator是一個function，可以傳入參數，並回傳一個action
export const { login, logout } = loginSlice.actions
// reducer存在於store中，當dispatch一個action時，會觸發reducer，並回傳一個新的state
export default loginSlice.reducer

