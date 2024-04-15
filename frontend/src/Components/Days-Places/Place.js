import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { convertTime } from '../../helpers/helpers';
import { useDispatch } from 'react-redux';
import PlaceRow from './PlaceRow';
import PlaceRowEdit from './PlaceRowEdit';

const Place = ({places, dayId}) => {
    const dispatch = useDispatch();
    const [editingRow, setEditingRow] = useState(null);

    const handleEdit = (rowIndex) => {
      setEditingRow(rowIndex);
    };
    const handleCancelRow = () => {
      setEditingRow(null);
    };

    

  function createData(id, name, time_to_visit, time_of_day, address, categories) {
    console.log(id)
    return {
      id,
      name,
      time_to_visit,
      time_of_day,
      details: {address: address, categories: categories }
    }
  };

console.log(places)

const rows = places.map((place) => createData(place.id, place.name, place.time_to_visit, convertTime(place.time_of_day), place.address, place.category))
// Styling for trip day details
const PlaceItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFFE6',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth: 200,
    marginLeft: 15,
    display: 'flex'
    }));
    
 return (
  <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Time to visit</TableCell>
            <TableCell align="right">Time of day</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            editingRow !== index 
              ? <PlaceRow key={row.name} row={row} editing={handleEdit} dayId={dayId} index={index}/> 
              : <PlaceRowEdit key={`edit-${row.name}`} row={row} cancel={handleCancelRow} editingRow={setEditingRow} dayId={dayId}/>
))}
        </TableBody>
      </Table>
    </TableContainer>
   
 )
}

export default Place;