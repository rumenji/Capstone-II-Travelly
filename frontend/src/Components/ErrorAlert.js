import { Alert } from "@mui/material";
import React from "react";
import ClearIcon from '@mui/icons-material/Clear';

const ErrorAlert = ({error}) => {
    return (
        <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
            {error}</Alert>
    )
}

export default ErrorAlert;