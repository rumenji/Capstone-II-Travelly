import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteTrip, placeDeleteFromDay } from '../thunks';

export default function DeleteDialog({props}) {
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if(props.tripId){
        dispatch(deleteTrip(props.tripId))
        navigate('/trips')
    } else {
        dispatch(placeDeleteFromDay({dayId: props.dayId, placeId: props.placeId}))
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <DeleteIcon onClick={handleClickOpen} fontSize='medium'/>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm deletion?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete ${props.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleConfirm} autoFocus>
            <Typography sx={{
          color: "red",
         }}>Delete</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}