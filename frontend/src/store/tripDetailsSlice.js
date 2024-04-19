import { createSlice } from "@reduxjs/toolkit";
import { fetchTripById, editTrip } from "../thunks";

const INITIAL_STATE = { tripDetails: {}, loading_tripDetails: false, error_tripDetails: null, success_tripDetails: false, selectedDay: null };

/**Slice for the selected trip details
 * Fetch and edit the trip
 */
export const tripDetailsSlice = createSlice({
    name: 'tripDetails',
    initialState: INITIAL_STATE,
    reducers: {
        setSelectedDay: (state, action) => {
            state.selectedDay = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTripById.pending, (state) => {
                state.loading_tripDetails = true;
                state.error_tripDetails = null;
            })
            .addCase(fetchTripById.fulfilled, (state, { payload }) => {
                state.tripDetails = payload;
                state.loading_tripDetails = false;
                state.error_tripDetails = null;
                state.success_tripDetails = true;
            })
            .addCase(fetchTripById.rejected, (state, { payload }) => {
                state.loading_tripDetails = false;
                state.error_tripDetails = payload;
            })
            .addCase(editTrip.pending, (state) => {
                state.loading_tripDetails = true;
                state.error_tripDetails = null;
            })
            .addCase(editTrip.fulfilled, (state, { payload }) => {
                state.tripDetails = payload.editedTrip;
                state.loading_tripDetails = false;
                state.error_tripDetails = null;
                state.success_tripDetails = true;
            })
            .addCase(editTrip.rejected, (state, { payload }) => {
                state.loading_tripDetails = false;
                state.error_tripDetails = payload;
            })
    }
})

//Gets the trip details
export const selectTripDetails = state => state.tripDetails.tripDetails;
export const { setSelectedDay } = tripDetailsSlice.actions;
export default tripDetailsSlice.reducer;
