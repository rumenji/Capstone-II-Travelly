import React from 'react';
import { useForm } from 'react-hook-form';
import { MenuItem, TextField, TableCell, TableRow } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { selectTime } from '../../helpers/helpers';
import { useDispatch } from 'react-redux';
import { placeEditToDay } from '../../thunks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

/**Inline edit place form - allows to change time to visit, time of day for the place */
function PlaceRowEdit(props) {
  const { row, cancel, dayId, editingRow } = props;
  const dispatch = useDispatch();
  const formSchema = yup.object().shape({
    time_of_day: yup.string()
        .required('Time of day to visit is required'),
    time_to_visit: yup.number()
        .min(0.1, 'Enter number larger than 0.1')
        .max(24, 'Enter number less than 24')
        .required('Time needed to visit is required')
    });
  const { register, getValues, formState: { errors } } = useForm({
      resolver: yupResolver(formSchema)
  });  
  //Handles saving of the edited row - allows for only time of day and time to visit changes
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
            error={errors.time_to_visit ? true : false}
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
            error={errors.time_of_day ? true : false}
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