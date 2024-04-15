import { createSlice } from "@reduxjs/toolkit";
import { fetchTrips, addNewTrip, deleteTrip } from "../thunks";

const INITIAL_STATE = { tripsList: [], loading_trips: false, error_trips: null, success_trips: false };

export const tripsListSlice = createSlice({
    name: 'trips',
    initialState: INITIAL_STATE,
    reducers: {
       
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTrips.pending, (state) => {
            state.loading_trips = true;
            state.error_trips = null;
        })
        .addCase(fetchTrips.fulfilled, (state, {payload}) => {
            state.loading_trips = false;
            state.error_trips = null;
            // Add any fetched trips to the array
            state.tripsList = [...payload];

        })
        .addCase(fetchTrips.rejected, (state, {payload}) => {
            state.loading_trips = false;
            state.error_trips = payload;
        })
        .addCase(addNewTrip.pending, (state) => {
            state.loading_trips = true;
            state.error_trips = null;
        })
        .addCase(addNewTrip.fulfilled, (state, {payload}) => {
            state.loading_trips = false;
            state.error_trips = null;
            state.success_trips = true
            state.tripsList.push(payload);
            state.tripsList.sort((a,b) => new Date(a.from_date) - new Date(b.from_date) );
        })
        .addCase(addNewTrip.rejected, (state, {payload}) => {
            state.loading_trips = false;
            state.error = payload;
        })
        .addCase(deleteTrip.pending, (state) => {
            state.loading_trips = true;
            state.error_trips = null;
        })
        .addCase(deleteTrip.fulfilled, (state, {payload}) => {
            state.loading_trips = false;
            state.error_trips = null;
            state.success_trips = true
            state.tripsList = state.tripsList.filter(trip => trip.id !== +payload)
        })
        .addCase(deleteTrip.rejected, (state, {payload}) => {
            state.loading_trips = false;
            state.error = payload;
        })
    }
})



export const selectAllTrips = state => state.trips.tripsList;
export const selectTripById = (state, tripId) => state.trips.tripsList.filter(trip => trip.id === tripId);

// export const {remove, add} = tripSlice.actions;
export default tripsListSlice.reducer;
