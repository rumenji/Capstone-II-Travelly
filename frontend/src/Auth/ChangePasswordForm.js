import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { changePassword } from "../thunks";
import { Box, Button, Stack, TextField, Link, Alert} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Spinner from "../Components/Spinner";

const UpdateUserForm = ({back, alert}) => {
    const { loading, userInfo } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [ apiError, setApiError ] = useState("")
    
    const formSchema = yup.object().shape({
        username: yup.string(),
        current_password: yup.string()
            .required('Current password is required')
            .min(5, 'Password must be at least 5 characters'),
        password: yup.string()
            .required('New password is required')
            .min(5, 'Password must be at least 5 characters')
            .notOneOf([yup.ref('current_password'), null], 'The new password cannot be the same as the current password!'), 
        confirm_password: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match') 
      });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(formSchema)
      })
    
    const submitForm = async (data) => {
        try{
        await dispatch(changePassword(data)).unwrap()
        setApiError('')
        back(false)
        alert(true)
        } catch (err) {     
            setApiError('Invalid current password!');    
        } }
        

    return (
        <Box justifyContent="center" sx={{  display: "flex", height: "100vh"}}>
            <form onSubmit={handleSubmit(submitForm)} style={{margin: "auto"}} noValidate>
            {apiError && <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
      {apiError }
  </Alert>}
                    <Stack spacing={0.5}>
                        <TextField type="hidden"
                                    name="username"
                                    id="username"
                                    defaultValue={userInfo.username}
                                    {...register('username', {value: userInfo.username})}
                                    required />
                        <TextField type="password"
                                    name="current_password"
                                    id="current_password"
                                    autoComplete="on"
                                    label="Current Password"
                                    error={errors.password ? true : false}
                                    helperText = {errors.password ? errors.password.message : ""}
                                    className='form-input'
                                    {...register('current_password')}
                                    required />

                        <TextField type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="on"
                                    label="New Password"
                                    error={errors.password ? true : false}
                                    helperText = {errors.password ? errors.password.message : ""}
                                    className='form-input'
                                    {...register('password')}
                                    required />
                                 
                        <TextField type="password"
                                    name="confirm_password"
                                    id="confirm_password"
                                    autoComplete="on"
                                    label="Confirm New Password"
                                    error={errors.confirm_password ? true : false}
                                    helperText = {errors.confirm_password ? errors.confirm_password.message : ""}
                                    className='form-input'
                                    // {...register('confirm_password')}
                                    required />
                            
                        <Button variant="outlined" color="warning" type='submit' className='save-button' disabled={loading}>
                                {loading ? <Spinner /> : 'Change password'}
                        </Button>
                        <Link variant="outlined" className='back-button' onClick={()=>back(false)}>Back</Link>
                    </Stack>
                </form>
            </Box>
    )
}

export default UpdateUserForm;