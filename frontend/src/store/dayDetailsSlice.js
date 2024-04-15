import { createSlice } from "@reduxjs/toolkit";
import { fetchDayById, placeDeleteFromDay, placeSaveToDay, placeEditToDay } from "../thunks";
import moment from 'moment';

const INITIAL_STATE = { dayDetails: {}, loading_dayDetails: false, error_dayDetails: null, success_dayDetails: false };

export const dayDetailsSlice = createSlice({
    name: 'dayDetails',
    initialState: INITIAL_STATE,
    reducers: {
       
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchDayById.pending, (state) => {
            state.loading_dayDetails = true;
            state.error_dayDetails = null;
        })
        .addCase(fetchDayById.fulfilled, (state, {payload}) => {
            state.dayDetails = payload;
            state.loading_dayDetails = false;
            state.error_dayDetails = null;
            state.success_dayDetails = true;
        })
        .addCase(fetchDayById.rejected, (state, {payload}) => {
            state.loading_dayDetails = false;
            state.error_dayDetails = payload;
        })
        .addCase(placeSaveToDay.pending, (state) => {
            state.loading_dayDetails = true;
            state.error_dayDetails = null;
        })
        .addCase(placeSaveToDay.fulfilled, (state, {payload}) => {
            state.dayDetails.places = [...state.dayDetails.places, payload];
            state.dayDetails.places = state.dayDetails.places.sort(
            (place1, place2) => {
                const place1Time = moment(place1.time_of_day, 'HH:mm:ss').valueOf();
                const place2Time = moment(place2.time_of_day, 'HH:mm:ss').valueOf();
                return place1Time - place2Time
            });
            state.loading_dayDetails = false;
            state.error_dayDetails = null;
            state.success_dayDetails = true;
        })
        .addCase(placeSaveToDay.rejected, (state, {payload}) => {
            state.loading_dayDetails = false;
            state.error_dayDetails = payload;
        })
        .addCase(placeEditToDay.pending, (state) => {
            state.loading_dayDetails = true;
            state.error_dayDetails = null;
        })
        .addCase(placeEditToDay.fulfilled, (state, {payload}) => {
            state.dayDetails.places = state.dayDetails.places.map(place => {
                if(place.id === payload.place_id) {
                    place.time_of_day = payload.time_of_day;
                    place.time_to_visit = payload.time_to_visit;
                    return place
                }
                return place
            });
            state.loading_dayDetails = false;
            state.error_dayDetails = null;
            state.success_dayDetails = true;
        })
        .addCase(placeEditToDay.rejected, (state, {payload}) => {
            state.loading_dayDetails = false;
            state.error_dayDetails = payload;
        })
        .addCase(placeDeleteFromDay.pending, (state) => {
            state.loading_dayDetails = true;
            state.error_dayDetails = null;
        })
        .addCase(placeDeleteFromDay.fulfilled, (state, {payload}) => {
            state.dayDetails.places = state.dayDetails.places.filter(place => place.id !== payload.place_id);
            state.loading_dayDetails = false;
            state.error_dayDetails = null;
            state.success_dayDetails = true;
        })
        .addCase(placeDeleteFromDay.rejected, (state, {payload}) => {
            state.loading_dayDetails = false;
            state.error_dayDetails = payload;
        })
    }
})



export const selectDayDetails = state => state.dayDetails.dayDetails;
export default dayDetailsSlice.reducer;