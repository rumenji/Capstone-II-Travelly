import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import ErrorAlert from "../ErrorAlert";
import { editTrip } from "../../thunks";
import { TextField, Box, Stack, Button, Typography, Alert } from '@mui/material';
import { selectTripDetails } from "../../store/tripDetailsSlice";
import { convertYYYYMMDD } from "../../helpers/helpers";
import { SpinnerButton } from "../Spinner";
import ClearIcon from '@mui/icons-material/Clear';

/**Form to edit a trip
 * Allows the name and dates to be changed
 * Doesn't allow location to be edited
 */
export const TripEditForm = ({ editing }) => {
    const { loading_tripDetails, error_tripDetails } = useSelector(state => state.tripDetails)
    const trip = useSelector(selectTripDetails);
    const dispatch = useDispatch()
    const { register, handleSubmit, setValue } = useForm()
    const [fromDate, setFromDate] = useState(null);
    const [apiError, setApiError] = useState("")

    const submitForm = async (formData) => {
        try {
            await dispatch(editTrip({ form: formData, tripId: trip.id })).unwrap()
            editing(false)
        } catch (err) {
            setApiError(err)
        }
    }
    console.log(trip.to_date)
    console.log(convertYYYYMMDD(trip.to_date))
    return (
        <Box justifyContent="center" sx={{ display: "flex", height: "100vh" }}>
            {error_tripDetails && <ErrorAlert error={error_tripDetails} />}
            {apiError && <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
                {apiError}</Alert>}
            <form onSubmit={handleSubmit(submitForm)} style={{ margin: "auto" }} noValidate>
                <Stack spacing={0.5}>
                    <Typography variant="subtitle1">Edit</Typography><Typography variant="h5">{trip.name}</Typography>
                    <Typography variant="subtitle1">Destination: {trip.location_name}</Typography>
                    <TextField type="text"
                        id="tripName"
                        name="name"
                        placeholder="Name of your trip"
                        defaultValue={trip.name}
                        className='form-input'
                        {...register('name')}
                        required />

                    <TextField type="date"
                        id="fromDate"
                        name="from_date"
                        className='form-input'
                        defaultValue={convertYYYYMMDD(trip.from_date)}
                        {...register('from_date')}
                        onChange={e => {
                            setFromDate(e.target.value);
                            e.target.value > convertYYYYMMDD(trip.to_date) &&
                                setValue('to_date', e.target.value);
                        }}
                        required />

                    <TextField type="date"
                        id="toDate"
                        name="to_date"
                        className='form-input'
                        defaultValue={convertYYYYMMDD(trip.to_date)}
                        {...register('to_date')}
                        inputProps={{ min: fromDate }}
                        required />
                    <Button variant="outlined" color="error" className='button' onClick={() => editing(false)}>Discard</Button>
                    <Button variant="outlined" color="warning" type='submit' className='button'>
                        {loading_tripDetails ? <SpinnerButton /> : 'Save'}
                    </Button>
                </Stack>
            </form>
        </Box>
    )
}