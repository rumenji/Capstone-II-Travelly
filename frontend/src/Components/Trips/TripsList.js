import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
import { selectAllTrips } from "../../store/tripsListSlice";
import { fetchTrips } from "../../thunks";
import { Trip } from "./Trip";
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { Button, Typography, Checkbox, FormControlLabel } from "@mui/material";
import CardTravelIcon from '@mui/icons-material/CardTravel';
import Spinner from "../Spinner";

export function TripsList () {
    const trips = useSelector(selectAllTrips);
    const {loading_trips, error_trips, success_trips} = useSelector(state => state.trips)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [ checked, setChecked ] = useState(false);

    const handleChecked = (event) => {
        setChecked(event.target.checked)
    }
    
    useEffect(() => {
        if(!loading_trips && !success_trips) {
            if(checked) {
                dispatch(fetchTrips(checked))
            } else {
                dispatch(fetchTrips())
            }
        }}, [dispatch, success_trips, checked])


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minWidth: 200
      }));

    const content = loading_trips ? 
                <Spinner />
    : !error_trips && !loading_trips ?
        trips.map((trip) => (
            <Item key={`item-${trip.id}`}><Trip 
                                            key={`trip-${trip.id}`}
                                            id={trip.id}
                                            name={trip.name} 
                                            days={trip.days}/></Item>
                                        ))
    :  <div>{error_trips}</div>
    
    return (
        <Container fixed>
            <Button size="large" color="warning" onClick={() => navigate("/add-trip")}><CardTravelIcon></CardTravelIcon>Plan your next trip</Button>
            <Typography variant="h3">Your trips:</Typography>
            <FormControlLabel labelPlacement="start" label= "Show past trips:" control={<Checkbox checked={checked} onChange={handleChecked} />}/>
            <Stack direction="column" sx={{ overflow: 'auto' }} spacing={{ xs: 1, sm: 1, md: 2 }}>
            {content}
            </Stack>
        </Container>
    )
}