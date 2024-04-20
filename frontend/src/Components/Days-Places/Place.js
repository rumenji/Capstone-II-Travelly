import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { convertTime } from '../../helpers/helpers';
import PlaceRow from './PlaceRow';
import PlaceRowEdit from './PlaceRowEdit';

/**Component to create a table with existing places for a day
 * Allows for editing a place
 */
const Place = ({ places, dayId }) => {
  const [editingRow, setEditingRow] = useState(null);

  //Shows the row edit form
  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
  };
  //Closes the row edit form
  const handleCancelRow = () => {
    setEditingRow(null);
  };

  function createData(id, name, time_to_visit, time_of_day, address, categories) {
    
    return {
      id,
      name,
      time_to_visit,
      time_of_day,
      details: { address: address, categories: categories }
    }
  };

  const rows = places.map((place) => createData(place.id, place.name, place.time_to_visit, convertTime(place.time_of_day), place.address, place.category))

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
              ? <PlaceRow key={row.name} row={row} editing={handleEdit} dayId={dayId} index={index} />
              : <PlaceRowEdit key={`edit-${row.name}`} row={row} cancel={handleCancelRow} editingRow={setEditingRow} dayId={dayId} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  )
}

export default Place;