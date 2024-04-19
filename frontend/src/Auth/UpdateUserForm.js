import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { updateUser } from "../thunks";
import { Box, Button, Stack, TextField, Link, Alert } from "@mui/material";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import Spinner from "../Components/Spinner";

/**Form component for user details edit
 * Uses yupResolver to validate form fields.
 * Requires user to enter password
 */
const UpdateUserForm = ({ back, alert }) => {
    const { loading, userInfo } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [apiError, setApiError] = useState("")

    const formSchema = yup.object().shape({
        username: yup.string(),
        email: yup.string().email('Invalid email format').required('Email is required'),
        first_name: yup.string()
            .required('First name is required')
            .min(2, 'First name must be at least 2 characters'),
        last_name: yup.string()
            .required('Last name is required'),
        current_password: yup.string()
            .required('Current password is required')
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(formSchema)
    })

    const submitForm = async (data) => {
        try {
            // transform email string to lowercase to avoid case sensitivity issues in login
            data.email = data.email.toLowerCase()
            await dispatch(updateUser(data)).unwrap()
            setApiError('')
            back(false)
            alert(true)
        } catch (err) {
            setApiError('Invalid current password!');
        }
    }


    return (
        <Box justifyContent="center" sx={{ display: "flex", height: "100vh" }}>
            <form onSubmit={handleSubmit(submitForm)} style={{ margin: "auto" }} noValidate>
                <Stack spacing={0.5}>
                {apiError && <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
                    {apiError}
                </Alert>}
                    <TextField type="text"
                        name="first_name"
                        id="first_name"
                        autoComplete="on"
                        label="First Name"
                        defaultValue={userInfo.first_name}
                        error={errors.first_name ? true : false}
                        helperText={errors.first_name ? errors.first_name.message : ""}
                        className='form-input'
                        {...register('first_name')}
                        required />

                    <TextField type="text"
                        name="last_name"
                        id="last_name"
                        autoComplete="on"
                        label="Last Name"
                        defaultValue={userInfo.last_name}
                        error={errors.last_name ? true : false}
                        helperText={errors.last_name ? errors.last_name.message : ""}
                        className='form-input'
                        {...register('last_name')}
                        required />

                    <TextField type="email"
                        name="email"
                        id="email"
                        autoComplete="on"
                        label="Email"
                        defaultValue={userInfo.email}
                        error={errors.email || apiError.includes("Email") ? true : false}
                        helperText={errors.email ? errors.email.message : apiError.includes("Email") ? apiError : ""}
                        className='form-input'
                        {...register('email')}
                        required />

                    <TextField type="hidden"
                        name="username"
                        id="username"
                        defaultValue={userInfo.username}
                        {...register('username', { value: userInfo.username })}
                        required />
                    <TextField type="password"
                        name="current_password"
                        id="current_password"
                        autoComplete="on"
                        label="Current Password"
                        error={errors.password ? true : false}
                        helperText={errors.password ? errors.password.message : ""}
                        className='form-input'
                        {...register('current_password')}
                        required />

                    <Button variant="outlined" color="warning" type='submit' className='save-button' disabled={loading}>

                        {loading ? <Spinner /> : 'Save'}
                    </Button>
                    <Link variant="outlined" className='back-button' onClick={() => back(false)}>Back</Link>
                </Stack>
            </form>
        </Box>
    )
}

export default UpdateUserForm;