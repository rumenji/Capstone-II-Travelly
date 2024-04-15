import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { Audio } from 'react-loader-spinner';
import ErrorAlert from "../ErrorAlert";
import { addNewTrip } from "../../thunks";
import { unwrapResult } from '@reduxjs/toolkit';
import { debounce } from "lodash";
import { locationSearch } from '../../thunks';
import { Autocomplete, TextField, Box, Stack, Button } from '@mui/material';

export const AddTripForm = () => {
    // const [searchTerm, setSearchTerm] = useState('');  
    const [searchResults, setSearchResults] = useState([]); 
    const { error, loading, success } = useSelector((state) => state.trips)
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, setValue } = useForm()
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [fromDate, setFromDate] = useState(null);

    const submitForm = (formData) => {
        if(selectedOption){
            console.log(selectedOption)
            formData.loc_long = selectedOption.position.lon.toString();
            formData.loc_lat = selectedOption.position.lat.toString();
        }
        console.log(formData)
        dispatch(addNewTrip(formData))
        }
        
    useEffect(() => {
        // redirect authenticated user to home screen
        if (success) navigate('/trips')
        }, [navigate, success])

    const searchTerm = watch("location_name", false);

    const getPlacePredictions = (query) => {
        if (query) {    
                    try {      
                    dispatch(locationSearch({query: query}))
                        .then(unwrapResult)
                        .then((result) => {
                            console.log(result)
                            setSearchResults(result)
                        });         
                } catch (error) {      
                    console.error('Search error:', error);    
                }  }
    }

    useEffect(() => {  debouncedGetPlacePredictions(searchTerm);}, [searchTerm]);  

    const debouncedGetPlacePredictions = useCallback(
        debounce(getPlacePredictions, 500),
        []
    );
    
    return (
        <Box justifyContent="center" sx={{  display: "flex", height: "100vh"}}>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            <form onSubmit={handleSubmit(submitForm)} style={{margin: "auto"}} noValidate>
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
      options={ searchResults }
    getOptionLabel={(option) => option.name}
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
                    inputProps={{min: fromDate}}
                    required />
            <Button variant="outlined" color="warning" type='submit' className='button'>
                    {loading ? <Audio /> : 'Save'}
                </Button>
                </Stack>
            </form>
        </Box>
    )
}