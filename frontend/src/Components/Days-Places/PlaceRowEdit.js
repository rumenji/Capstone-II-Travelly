import React from 'react';
import { useForm } from 'react-hook-form';
import { MenuItem, TextField, TableCell, TableRow } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { selectTime } from '../../helpers/helpers';
import { useDispatch } from 'react-redux';
import { placeEditToDay } from '../../thunks';

/**Inline edit place form - allows to change time to visit, time of day for the place */
function PlaceRowEdit(props) {
  const { row, cancel, dayId, editingRow } = props;
  const { register, getValues } = useForm();
  const dispatch = useDispatch();

  const handleSaveRow = (rowIndex, timeToVisit, timeOfDay) => {
    // Save changes to the database or perform any other actions

    const formData = { id: rowIndex, time_of_day: timeOfDay, time_to_visit: timeToVisit }
    dispatch(placeEditToDay({ query: formData, dayId: dayId }))
    editingRow(null);
  };

  return (
    <React.Fragment>

      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="td" scope="row"></TableCell>
        <TableCell component="td" scope="row">
          {row.name}
        </TableCell>
        <TableCell component="td" scope="row">
          <TextField type="number"
            id="timeToVisit"
            name="time_to_visit"
            label="Select time to visit"
            defaultValue={row.time_to_visit}
            size="small"
            sx={{ width: 150 }}
            {...register('time_to_visit')}
            required />
        </TableCell>
        <TableCell component="td" scope="row">
          <TextField select
            id="timeOfDay"
            name="time_of_day"
            label="Select time of day"
            defaultValue={row.time_of_day}
            size="small"
            sx={{ width: 150 }}
            {...register('time_of_day')}
            required>
            <MenuItem value="">Select time</MenuItem>
            {selectTime()}
          </TextField>
        </TableCell>
        <TableCell component="td" scope="row">
          <CheckIcon fontSize='medium' sx={{ color: "green" }} onClick={() => {
            const timeOfDay = getValues('time_of_day');
            const timeToVisit = getValues('time_to_visit');
            handleSaveRow(row.id, timeToVisit, timeOfDay)
          }} />
          <ClearIcon fontSize='medium' sx={{ color: "red" }} onClick={() => cancel()} />
        </TableCell>

      </TableRow>

    </React.Fragment>
  )
};

export default PlaceRowEdit;