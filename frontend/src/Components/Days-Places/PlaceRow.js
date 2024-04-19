import React, { useState } from 'react';
import { Typography, Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteDialog from '../DeleteDialog';

/**Component to displays rows in the places table 
 * Collapsable - displays extra details about the place
*/
function PlaceRow(props) {
  const { row, dayId, editing, index } = props;
  const [open, setOpen] = useState(false);
  const categories = row.details.categories.map((category => category.charAt(0).toUpperCase() + category.slice(1)))

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.time_to_visit}</TableCell>
        <TableCell align="right">{row.time_of_day}</TableCell>
        <TableCell align="right"><EditIcon fontSize='medium' onClick={() => editing(index)} /><DeleteDialog props={{ name: row.name, dayId: dayId, placeId: row.id }} /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.details.address}
                    </TableCell>
                    <TableCell>{categories.join(', ')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
};

export default PlaceRow;