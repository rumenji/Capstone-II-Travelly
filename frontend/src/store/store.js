import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tripsListReducer from './tripsListSlice';
import tripDetailsReducer from './tripDetailsSlice';
import dayDetailsReducer from './dayDetailsSlice';
import authReducer from './authSlice';


/**Export a configureStore function instead of the store for making testing easier */
const rootReducer = combineReducers({
  trips: tripsListReducer,
  tripDetails: tripDetailsReducer,
  dayDetails: dayDetailsReducer,
  auth: authReducer,
})

export const setupStore = preloadedState => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}