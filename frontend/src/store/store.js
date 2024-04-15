import { configureStore } from '@reduxjs/toolkit';
import tripsListReducer from './tripsListSlice';
import tripDetailsReducer from './tripDetailsSlice';
import dayDetailsReducer from './dayDetailsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    trips: tripsListReducer,
    tripDetails: tripDetailsReducer,
    dayDetails: dayDetailsReducer,
    auth: authReducer,
  }
,
})