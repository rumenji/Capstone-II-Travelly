import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { MenuItem, Stack, Autocomplete, TextField, Button } from '@mui/material';
import { selectTime } from '../../helpers/helpers';
import { unwrapResult } from '@reduxjs/toolkit';
import { debounce } from "lodash";
import { placeSearch, placeSave, placeSaveToDay } from '../../thunks';
import ErrorAlert from '../ErrorAlert';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

/**Form component to add places to a day
 * Calls place related thunks to query the external API
 * Debouncing - allows for a timeout after the user has stopped typing to query to avoid too many requests
 */
const PlaceAddForm = ({ tripId, dayId }) => {
    const formSchema = yup.object().shape({
        place_name: yup.string()
            .required('Select a place first'),
        time_of_day: yup.string()
            .required('Time of day to visit is required'),
        time_to_visit: yup.string()
            .min(0.1, 'Enter number larger than 0.1')
            .max(24, 'Enter number less than 24')
            .required('Time needed to visit is required')
    });
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        resolver: yupResolver(formSchema)
    });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const dispatch = useDispatch();
    const [clearAutocomplete, setClearAutocomplete] = useState(false);
    const [selectedPlaceError, setSelectedPlaceError] = useState(null)

    //Submits the add new place form and resets the form state including autocomplete fields
    const submitForm = (formData) => {
        if (selectedPlace) {
            try {
                formData.id = selectedPlace.id;
                dispatch(placeSave(selectedPlace))
                    .then(dispatch(placeSaveToDay({ query: formData, dayId: dayId })))
                    .then(reset())
                    .then(setSelectedPlace(null))
                    .then(setClearAutocomplete(!false))
            } catch (error) {
                setSelectedPlaceError(error)
            }
        }
    }

    const searchTerm = watch("place_name", false);

    //Queries the backend to send a request to the external API
    //Sets the returned results in the state
    const getPlacePredictions = (query) => {
        if (query) {
            try {
                dispatch(placeSearch({ query: query, trip_id: tripId }))
                    .then(unwrapResult)
                    .then((result) => {
                        setSearchResults(result)
                    });
            } catch (error) {
                setSelectedPlaceError(error)
            }
        }
    }

    //Lodash debounce to call the search function after a set timeout 
    const debouncedGetPlacePredictions = useCallback(
        debounce(getPlacePredictions, 500),
        []
    );

    useEffect(() => { debouncedGetPlacePredictions(searchTerm); }, [searchTerm, debouncedGetPlacePredictions]);

    return (<form onSubmit={handleSubmit(submitForm)} style={{ margin: "auto" }} noValidate>
        <Stack spacing={0.5} direction={"row"}>
            {selectedPlaceError && <ErrorAlert error={selectedPlaceError} />}
            <Autocomplete
                key={clearAutocomplete ? `autocomplete-selected` : `autocomplete-empty`}
                disablePortal
                id="place-search"
                sx={{ width: 300 }}
                onChange={(event, newValue) => {
                    setSelectedPlace(newValue);
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
                        id="placeName"
                        name="place_name"
                        label="Search for places"
                        className='form-input'
                        error={errors.place_name ? true : false}
                        size="small"
                        {...register('place_name')}
                        required
                    />
                )}
            />

            <TextField type="number"
                id="timeToVisit"
                name="time_to_visit"
                label="Select time to visit"
                className='form-input'
                size="small"
                error={errors.time_to_visit ? true : false}
                sx={{ width: 150 }}
                {...register('time_to_visit')}
                required />

            <TextField select
                key={clearAutocomplete ? `selectTime-selected` : `selectTime-empty`}
                id="timeOfDay"
                name="time_of_day"
                label="Select time of day"
                className='form-input'
                defaultValue=""
                error={errors.time_of_day ? true : false}
                size="small"
                sx={{ width: 150 }}
                {...register('time_of_day')}
                required>
                <MenuItem value="">Select time</MenuItem>
                {selectTime()}
            </TextField>
            <Button variant="outlined" color="warning" type='submit' className='button'>
                Add
            </Button>
        </Stack>
    </form>
    )
}

export default PlaceAddForm;