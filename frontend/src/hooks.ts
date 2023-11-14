import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// useSelector是react-redux提供的一個hook，可以從store中取得state
// 使用useSelector時，必須傳入一個function，function的參數是state，並回傳一個state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// useDispatch是react-redux提供的一個hook，可以取得dispatch function
// 使用useDispatch時，可以直接dispatch一個action
export const useAppDispatch = () => useDispatch<AppDispatch>()
