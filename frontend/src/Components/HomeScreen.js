import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Box, Stack } from "@mui/material";
import Spinner from "./Spinner";

/**Welcome screen for the logged in user or log to get access to the app if not logged in*/
const HomeScreen = () => {
    const { userInfo, loading } = useSelector((state) => state.auth)
    const navigate = useNavigate();
    
    const welcomeMsg = loading ?
        <Spinner />

        : !userInfo ?

        <Box>
            <Typography paragraph variant="h3">Welcome to Travelly!</Typography>
            <Typography paragraph variant="h4">Ready to start planning your trip?</Typography>
            <Button variant="text" color="warning" onClick={() => navigate("/login")} sx={{ cursor: 'pointer' }}>Login</Button>
            <Typography variant="outline">or</Typography>
            <Button variant="text" color="warning" onClick={() => navigate("/register")} sx={{ cursor: 'pointer' }}>register</Button>
            <Typography variant="outline">if you don't have an account</Typography>
        </Box>
        :
        <Box>
            <Typography paragraph variant="h3">Welcome back, {userInfo.first_name.charAt(0).toUpperCase() + userInfo.first_name.slice(1)}!</Typography>
            <Button variant="text" color="warning" onClick={() => navigate("/add-trip")} sx={{ cursor: 'pointer' }}>Let's plan your next trip?</Button>
        </Box>


    return (
        <Stack justifyContent="center" sx={{ height: "100vh" }}>
            {welcomeMsg}
        </Stack>
    )
}

export default HomeScreen;