import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectDayDetails } from '../../store/dayDetailsSlice';
import { fetchDayById } from '../../thunks';
import { Stack, Box, Typography } from '@mui/material';
import { convertDate } from '../../helpers/helpers';
import Place from './Place';

import PlaceAddForm from '../Days-Places/PlaceAddForm';

const DayDetails = ({dayId}) => {
    const day = useSelector(selectDayDetails);
    const dispatch = useDispatch();
    const {tripDetails} = useSelector(state => state.tripDetails)
    

    useEffect(() => {
                dispatch(fetchDayById(dayId))
    }, [dispatch, dayId])


    return (
    <Box>
    <Typography variant="h6">Activities for {convertDate(day.name)}</Typography>
    
    <Stack direction="column" sx={{ overflow: 'auto' }} spacing={{ xs: 1, sm: 1, md: 2 }}>
    <PlaceAddForm tripId={tripDetails.id} dayId={day.id}/>
    {day.places && day.places.length > 0 ? <Place places={day.places} dayId={day.id}/> : <Typography variant='body1'>No activities for the selected day.</Typography>}
    
    </Stack>
  </Box>
      
    );
  };
export default DayDetails;