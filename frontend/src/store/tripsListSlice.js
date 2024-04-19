import { createSlice } from "@reduxjs/toolkit";
import { fetchTrips, addNewTrip, deleteTrip } from "../thunks";

const INITIAL_STATE = { tripsList: [], loading_trips: false, error_trips: null, success_trips: false };

/**Slice for getting all trips for the user
 * Fetch/add/delete drips
 */
export const tripsListSlice = createSlice({
    name: 'trips',
    initialState: INITIAL_STATE,
    reducers: {
        setSuccessTrips: (state, action) => {
            state.success_trips = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrips.pending, (state) => {
                state.loading_trips = true;
                state.error_trips = null;
            })
            .addCase(fetchTrips.fulfilled, (state, { payload }) => {
                state.loading_trips = false;
                state.error_trips = null;
                state.tripsList = [...payload];

            })
            .addCase(fetchTrips.rejected, (state, { payload }) => {
                state.loading_trips = false;
                state.error_trips = payload;
            })
            .addCase(addNewTrip.pending, (state) => {
                state.loading_trips = true;
                state.error_trips = null;
            })
            .addCase(addNewTrip.fulfilled, (state, { payload }) => {
                state.loading_trips = false;
                state.error_trips = null;
                state.success_trips = true
                state.tripsList.push(payload);
                state.tripsList.sort((a, b) => new Date(a.from_date) - new Date(b.from_date));
            })
            .addCase(addNewTrip.rejected, (state, { payload }) => {
                state.loading_trips = false;
                state.error = payload;
            })
            .addCase(deleteTrip.pending, (state) => {
                state.loading_trips = true;
                state.error_trips = null;
            })
            .addCase(deleteTrip.fulfilled, (state, { payload }) => {
                state.loading_trips = false;
                state.error_trips = null;
                state.success_trips = true
                state.tripsList = state.tripsList.filter(trip => trip.id !== +payload)
            })
            .addCase(deleteTrip.rejected, (state, { payload }) => {
                state.loading_trips = false;
                state.error = payload;
            })
    }
})

//Gets all trips
export const selectAllTrips = state => state.trips.tripsList;
//Gets a trip by ID
export const selectTripById = (state, tripId) => state.trips.tripsList.filter(trip => trip.id === tripId);
export const { setSuccessTrips } = tripsListSlice.actions;
export default tripsListSlice.reducer;
