// ProfileScreen.js
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import UpdateUserForm from './UpdateUserForm';
import ChangePasswordForm from './ChangePasswordForm';
import { Alert, Box, Typography, Stack, Button, styled, Divider } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { userFriendlyDateTime } from '../helpers/helpers';
import "./ProfileScreen.css";

const ProfileScreen = () => {
  const { userInfo, message } = useSelector((state) => state.auth)
  const [editingUser, setEditingUser] = useState(false)
  const [passwordChange, setPasswordChange] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  
  const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    textAlign: "left",
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(2),
    },
  }));
  // On componentDidMount set the timer
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShowAlert(false)
    }, 5000)

    return () => {
      clearTimeout(timeId)
    }
  }, [showAlert]);

  const content = editingUser ? <UpdateUserForm back={setEditingUser} alert={setShowAlert}/> 
  : passwordChange ? <ChangePasswordForm back={setPasswordChange}  alert={setShowAlert}/>
  :  
  <Box>
  <Root textAlign="left">
    <Typography  variant="overline" sx={{fontSize: "20px"}}>User details for {userInfo.first_name}:</Typography>
    <Divider><Typography  className='labels'>Username: </Typography></Divider>
    <Typography className='user-info'>{userInfo.username}</Typography>
    <Divider><Typography className='labels'>First name: </Typography></Divider>
    <Typography className='user-info'>{userInfo.first_name}</Typography>
    <Divider><Typography className='labels'>Last name: </Typography></Divider>
    <Typography className='user-info'>{userInfo.last_name}</Typography>
    <Divider><Typography className='labels'>Email: </Typography></Divider>
    <Typography className='user-info'>{userInfo.email}</Typography>
    <Divider><Typography className='labels'>Joined: </Typography></Divider>
    <Typography className='user-info'>{userFriendlyDateTime(userInfo.join_at)}</Typography>
    <Divider><Typography className='labels'>Last login: </Typography></Divider>
    <Typography className='user-info'>{userFriendlyDateTime(userInfo.last_login_at)}</Typography>
      <Button variant="outlined" color="warning" onClick={() => setEditingUser(true)} sx={{cursor: 'pointer'}}>Edit User Details</Button>
      <Button variant="outlined" color="warning" onClick={() => setPasswordChange(true)} sx={{cursor: 'pointer'}}>Change Password</Button>
  </Root>
  </Box>
  return (
    <React.Fragment>
      {message && showAlert && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      {message}
  </Alert>}
    <Stack justifyContent="center" alignItems="center" sx={{  height: "100vh"}}>
    {content}
    </Stack>
    </React.Fragment>
  )
}
export default ProfileScreen