import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import ErrorAlert from "../ErrorAlert";
import { addNewTrip } from "../../thunks";
import { unwrapResult } from '@reduxjs/toolkit';
import { debounce } from "lodash";
import { locationSearch } from '../../thunks';
import { Autocomplete, TextField, Box, Stack, Button } from '@mui/material';
import { SpinnerButton } from "../Spinner";

/**Form component to add a trip
 * Sends a request to the backend to request matching locations for the trip
 * Uses lodash debounce to set a timeout to avoid too many requests while typing
 */
export const AddTripForm = () => {
    const [searchResults, setSearchResults] = useState([]);
    const { error_trips, loading_trips } = useSelector((state) => state.trips)
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, setValue } = useForm()
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [searchError, setSearchError] = useState(null)

    //Saves trip data - extracts the info required from the selected location from the external API
    //Redirects to trip list after successful submission
    const submitForm = async (formData) => {
        if (selectedOption) {
            formData.loc_long = selectedOption.position.lon.toString();
            formData.loc_lat = selectedOption.position.lat.toString();
        }
        try {
            await dispatch(addNewTrip(formData)).unwrap()
            navigate('/trips')
        } catch (err) {
            setSearchError(err)
        }
        
    }

    const searchTerm = watch("location_name", false);
    //Queries the external API for locations that match the query
    const getPlacePredictions = (query) => {
        if (query) {
            try {
                dispatch(locationSearch({ query: query }))
                    .then(unwrapResult)
                    .then((result) => {
                        setSearchResults(result)
                    });
            } catch (error) {
                setSearchError(error)
            }
        }
    }

    //Debounce function to delay external API request
    const debouncedGetPlacePredictions = useCallback(
        debounce(getPlacePredictions, 500),
        []
    );

    useEffect(() => { debouncedGetPlacePredictions(searchTerm); }, [searchTerm, debouncedGetPlacePredictions]);

    return (
        <Box justifyContent="center" sx={{ display: "flex", height: "100vh" }}>
            {error_trips && <ErrorAlert error={error_trips} />}
            {searchError && <ErrorAlert error={searchError} />}
            <form onSubmit={handleSubmit(submitForm)} style={{ margin: "auto" }} noValidate>
                <Stack spacing={0.5}>

                    <TextField type="text"
                        id="tripName"
                        name="name"
                        placeholder="Name of your trip"
                        className='form-input'
                        {...register('name')}
                        required />

                    <Autocomplete
                        disablePortal
                        id="destination-search"
                        sx={{ width: 300 }}
                        onChange={(event, newValue) => {
                            setSelectedOption(newValue);
                        }}
                        options={searchResults}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        renderOption={(props, option) => {
                            return (
                              <li {...props} key={option.id}>
                                {option.name}
                              </li>
                            );
                          }}
                        renderInput={(params) => (
                            <TextField {...params}
                                type="text"
                                id="locationName"
                                name="location_name"
                                label="Search for destination"
                                className='form-input'
                                {...register('location_name')}
                                required
                            />
                        )}
                    />

                    <TextField type="date"
                        id="fromDate"
                        name="from_date"
                        className='form-input'
                        {...register('from_date')}
                        onChange={e => {
                            setFromDate(e.target.value);
                            setValue('to_date', e.target.value);
                        }}
                        required />

                    <TextField type="date"
                        id="toDate"
                        name="to_date"
                        className='form-input'
                        {...register('to_date')}
                        inputProps={{ min: fromDate }}
                        required />
                    <Button variant="outlined" color="warning" type='submit' className='button'>
                        {loading_trips ? <SpinnerButton /> : 'Save'}
                    </Button>
                </Stack>
            </form>
        </Box>
    )
}