import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from '@mui/material';

const MyTable = () => {
  const [rows, setRows] = useState([
    { id: 1, name: 'John', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25 },
    // Add more rows as needed
  ]);

  const [editingRow, setEditingRow] = useState(null);

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
  };
  const handleCancelRow = () => {
    setEditingRow(null);
  };
  const handleSave = (rowIndex) => {
    // Save changes to the database or perform any other actions
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      name: document.getElementById(`name-${rowIndex}`).value,
      email: document.getElementById(`email-${rowIndex}`).value,
      age: document.getElementById(`age-${rowIndex}`).value,
    };
    setRows(updatedRows);
    setEditingRow(null);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              {editingRow === index ? (
                // Display input fields for editing
                <>
                  <TableCell><TextField id={`name-${index}`} defaultValue={row.name} /></TableCell>
                  <TableCell><TextField id={`email-${index}`} defaultValue={row.email} /></TableCell>
                  <TableCell><TextField id={`age-${index}`} defaultValue={row.age} /></TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleSave(index)}>Save</Button>
                    <Button variant="contained" color="warning" onClick={() => handleCancelRow(index)}>Cancel</Button>
                  </TableCell>
                </>
              ) : (
                // Display table cells in normal mode
                <>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(index)}>Edit</Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTable;