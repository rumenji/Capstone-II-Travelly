import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import ErrorAlert from "../Components/ErrorAlert";
import { loginUser } from "../thunks";
import { Button, Box, Stack, TextField, Alert } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import Spinner from "../Components/Spinner";

const LoginForm = () => {
    const { loading, userInfo, error, message } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [showAlert, setShowAlert] = useState(true)
    const [ apiError, setApiError ] = useState("")
    
    const formSchema = yup.object().shape({
        username: yup.string()
            .required('Username is required'),
        password: yup.string()
            .required('Password is required')
      });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(formSchema)
      })

      useEffect(() => {
        if (error) {
                setApiError("Incorrect credentials!")
        }
    }, [error, setApiError])

    const submitForm = (data) => {
        dispatch(loginUser(data))
    }
        
    const navigate = useNavigate();
    useEffect(() => {
        const timeId = setTimeout(() => {
          // After 3 seconds set the show value to false
          setShowAlert(false)
        }, 15000)
    
        return () => {
          clearTimeout(timeId)
        }
      }, [showAlert]);

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
        }, [navigate, userInfo])

    return (
        <React.Fragment>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            {message.includes('Registration is successful!') && showAlert && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      {message}
  </Alert>}
        <Box justifyContent="center" sx={{  display: "flex", height: "100vh"}}>
            <form onSubmit={handleSubmit(submitForm)} style={{margin: "auto"}} noValidate>
                <Stack spacing={0.5}>
                    <TextField type="text"
                                name="username"
                                id="username"
                                autoComplete="on"
                                label="Username"
                                error={ errors.username || apiError ? true : false }
                                helperText = { errors.username ? errors.username.message : "" }
                                className='form-input'
                                {...register('username')}
                                required />
                                        
                    <TextField type="password"
                                name="password"
                                id="password"
                                autoComplete="on"
                                label="Password"
                                error={ errors.password || apiError ? true : false }
                                helperText = { errors.password ? errors.password.message : apiError ? apiError : "" }
                                className='form-input'
                                {...register('password')}
                                required />
                    <Button variant="outlined" color="warning" type='submit' className='button' disabled={loading}>
                            {loading ? <Spinner /> : 'Login'}
                    </Button>
                </Stack>
            </form>
        </Box>
        </React.Fragment>
    )
}

export default LoginForm;