import { Alert } from "@mui/material";
import React from "react";
import ClearIcon from '@mui/icons-material/Clear';

/**Error alert component */
const ErrorAlert = ({ error }) => {
    return (
        <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
            {error}</Alert>
    )
}

export default ErrorAlert;