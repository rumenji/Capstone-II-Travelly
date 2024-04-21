import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Badge from '@mui/material/Badge';
import { convertDate } from "../../helpers/helpers";
import { setSelectedDay } from '../../store/tripDetailsSlice';

/**Component to display a trip element in the list of trips
 * Collapsable - can display the days for each trip
 * Clicking on a day displays the day details
 */
export function Trip({ id, name, days }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    //Expands and collapses days of trip
    const handleCollapseClick = () => {
        setOpen(!open);
    };

    //Clicking on a day shows the trip details with the day selected
    const handleDayClick = (day) => {
        dispatch(setSelectedDay(day))
        navigate(`/trips/${id}`)
    };

    //Opens the trip details with no day selected
    const handleTripClick = (id) => {
        dispatch(setSelectedDay(null))
        navigate(`/trips/${id}`)
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={3} sx={{ minWidth: '140px' }}>
                <Button color="warning" onClick={() => handleTripClick(id)}>Details</Button>
                <Box><CalendarTodayIcon fontSize="large" /></Box>
                <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    badgeContent={convertDate(days[0].name)} color="warning" sx={{ minWidth: "4em" }}>
                </Badge>
                <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={convertDate(days[days.length - 1].name)} color="warning" sx={{ minWidth: "4em" }}>
                </Badge>
            </Grid>
            <Grid item xs={9}>
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    component="nav">
                    <ListItemButton onClick={handleCollapseClick}>
                        <ListItemText primaryTypographyProps={{ fontSize: '24px' }} primary={name} secondary={`Days: ${days.length}`} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {days.map(day => (
                                <ListItemButton key={`day-${day.id}`} sx={{ pl: 4 }} onClick={() => handleDayClick(day)}>
                                    <ListItemText primary={convertDate(day.name)} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </List>
            </Grid>

        </Grid>
    )
};