import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Stack, Grid, Container, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { selectTripDetails } from '../../store/tripDetailsSlice';
import { fetchTripById } from '../../thunks';
import DayDetails from '../Days-Places/DayDetails';
import { convertDate } from '../../helpers/helpers';
import { setSelectedDay } from '../../store/tripDetailsSlice';
import DeleteDialog from '../DeleteDialog';
import Spinner from '../Spinner';
import { TripEditForm } from './TripEditForm';
import ErrorAlert from '../ErrorAlert';

/**Component to show trip details
 * Uses URL parameter for the ID
 * Displays an edit component to edit the trip
 */
const TripDetails = () => {
    const { tripId } = useParams();
    const trip = useSelector(selectTripDetails);
    const { loading_tripDetails, error_tripDetails, success_tripDetails, selectedDay } = useSelector(state => state.tripDetails)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    if (error_tripDetails && error_tripDetails.includes('Unauthorized')) navigate('/')
    if (error_tripDetails && error_tripDetails.includes('No trip')) navigate('/trips_not_found')

    useEffect(() => {
        if (!loading_tripDetails && +tripId !== trip.id) dispatch(fetchTripById(tripId))
    }, [dispatch, success_tripDetails, tripId, trip.id, loading_tripDetails])


    // Styling for trip details header
    const HeaderItem = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFFE6',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minWidth: 200
    }));
    // Styling for trip days buttons
    const DateItem = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFF',
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minWidth: 110
    }));
    // Styling for trip day details
    const DayDetailsItem = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFFE6',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minWidth: 200,
        marginLeft: 15
    }));

    const handleTripEdit = () => {
        setIsEditing(true)
    };

    if (isEditing) return <TripEditForm editing={setIsEditing} />


    const content = loading_tripDetails ?
        <Spinner />
        : !loading_tripDetails && !error_tripDetails && success_tripDetails ?
            // Grid for dispalying the trip details component
            <Grid container spacing={2}>
                {/* Grid for displaying the trip header details */}
                <Grid item xs={12} sx={{ marginTop: "50px" }}>
                    <HeaderItem>
                        <Typography sx={{ padding: "20px" }} variant='h3'>{trip.name}</Typography>
                        <Typography sx={{ padding: "20px" }} variant='h4'>{trip.location_name}</Typography>
                        {/* Grid for dates and buttons */}
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant='body1'>{convertDate(trip.days[0].name)}</Typography>
                            <CalendarTodayIcon fontSize="large" sx={{ padding: "10px" }} />
                            <Typography variant='body1'>{convertDate(trip.days[trip.days.length - 1].name)}</Typography>
                        </Grid>
                        <EditIcon fontSize="medium" onClick={handleTripEdit}>Edit</EditIcon>
                        <DeleteDialog props={{ name: trip.name, tripId: tripId }} />

                    </HeaderItem>
                </Grid>
                <Grid item xs={1}>
                    <List component="div">
                        <Stack spacing={0.3}>
                            {trip.days.map((day) => (
                                <DateItem key={`item-${day.id}`}>
                                    <ListItemButton key={`day-${day.id}`} selected={selectedDay === day} onClick={() => dispatch(setSelectedDay(day))}>
                                        <CalendarTodayIcon fontSize="small" sx={{ paddingRight: "5px" }} />
                                        <ListItemText primary={convertDate(day.name)} />
                                    </ListItemButton>
                                </DateItem>
                            ))}
                        </Stack>
                    </List>
                </Grid>
                <Grid item xs={11}>
                    <DayDetailsItem>
                        <Typography variant='h5'>Select day to view scheduled activities</Typography>
                        {selectedDay && (
                            <DayDetails dayId={selectedDay.id} />
                        )}
                    </DayDetailsItem>
                </Grid>
            </Grid>
            :
            <div>{error_tripDetails && <ErrorAlert error={error_tripDetails} />}</div>
    return (
        <Container fixed>

            {content}

        </Container>
    );
};

export default TripDetails;