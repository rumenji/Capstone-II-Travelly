import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import ErrorAlert from "../Components/ErrorAlert";
import { registerUser } from "../thunks";
import {Box, Button, Stack, TextField } from "@mui/material";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Spinner from "../Components/Spinner";

const RegisterForm = () => {
    const { loading, userInfo, error, success } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [ apiError, setApiError ] = useState("")
    
    const formSchema = yup.object().shape({
        email: yup.string().email('Invalid email format').required('Email is required'),
        first_name: yup.string()
            .required('First name is required')
            .min(2, 'First name must be at least 2 characters'),
        last_name: yup.string()
            .required('Last name is required'),
        username: yup.string()
            .required('Username is required')
            .min(4, 'Username must be at least 4 characters'),
        password: yup.string()
            .required('Password is required')
            .min(5, 'Password must be at least 5 characters'), 
        confirm_password: yup.string()
            .required('Please confirm your password')
            .oneOf([yup.ref('password'), null], 'Passwords must match') 
      });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(formSchema)
      })

    useEffect(() => {
        if (error) {
            if(error.includes('Duplicate username')){
                setApiError("Username already taken! Please change!")
            } else if (error.includes('Duplicate email')){
                setApiError("Email already in use! Please use a different email address!")
            }
        }
    }, [error, setApiError])
    
    

    const submitForm = (data) => {
        // transform email string to lowercase to avoid case sensitivity issues in login
        data.email = data.email.toLowerCase()
        dispatch(registerUser(data))
        }
        
    useEffect(() => {
        // redirect user to login page if registration was successful
        if (success) navigate('/login')
        // redirect authenticated user to home screen
        if (userInfo) navigate('/')
        }, [navigate, userInfo, success]) 

    return (
        <Box justifyContent="center" sx={{  display: "flex", height: "100vh"}}>
            <form onSubmit={handleSubmit(submitForm)} style={{margin: "auto"}} noValidate>
                    {error ? <ErrorAlert>{error}</ErrorAlert> : null}
                    <Stack spacing={0.5}>
                        <TextField type="text"
                                    name="first_name"
                                    id="first_name"
                                    autoComplete="on"
                                    label="First Name"
                                    error={errors.first_name ? true : false}
                                    helperText = {errors.first_name ? errors.first_name.message : ""}
                                    className='form-input'
                                    {...register('first_name')}
                                    required /> 
                        
                        <TextField type="text"
                                    name="last_name"
                                    id="last_name"
                                    autoComplete="on"
                                    label="Last Name"
                                    error={errors.last_name ? true : false}
                                    helperText = {errors.last_name ? errors.last_name.message : ""}
                                    className='form-input'
                                    {...register('last_name')}
                                    required />
                       
                        <TextField type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="on"
                                    label="Email"
                                    error={errors.email || apiError.includes("Email") ? true : false}
                                    helperText = {errors.email ? errors.email.message : apiError.includes("Email") ? apiError : ""}
                                    className='form-input'
                                    {...register('email')}
                                    required />
                    
                        <TextField type="text"
                                    name="username"
                                    id="username"
                                    autoComplete="on"
                                    label="Username"
                                    error={errors.username || apiError.includes("Username") ? true : false}
                                    helperText = {errors.username ? errors.username.message : apiError.includes("Username") ? apiError : ""}
                                    className='form-input'
                                    {...register('username')}
                                    required />
                                    
                        <TextField type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="on"
                                    label="Password"
                                    error={errors.password ? true : false}
                                    helperText = {errors.password ? errors.password.message : ""}
                                    className='form-input'
                                    {...register('password')}
                                    required />
                                 
                        <TextField type="password"
                                    name="confirm_password"
                                    id="confirm_password"
                                    autoComplete="on"
                                    label="Confirm Password"
                                    error={errors.confirm_password ? true : false}
                                    helperText = {errors.confirm_password ? errors.confirm_password.message : ""}
                                    className='form-input'
                                    {...register('confirm_password')}
                                    required />
                            
                        <Button variant="outlined" color="warning" type='submit' className='save-button' disabled={loading}>
                                {loading ? <Spinner /> : 'Register'}
                        </Button>
                    </Stack>
                </form>
            </Box>
    )
}

export default RegisterForm