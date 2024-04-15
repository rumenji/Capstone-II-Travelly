import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Box, Stack } from "@mui/material";
import Spinner from "./Spinner";

const HomeScreen = () => {
    const {userInfo, loading} = useSelector((state) => state.auth)
    const navigate = useNavigate();

    const welcomeMsg = loading ?
        <Spinner />
    :   
    
        <Box>
      <Typography paragraph variant="h3">Welcome back, {userInfo.first_name}!</Typography>
      <Button variant="text" color="warning" onClick={() => navigate("/add-trip")} sx={{cursor: 'pointer'}}>Let's plan your next trip?</Button>
      </Box>
    
    
    return (
        <Stack justifyContent="center" sx={{  height: "100vh"}}>
            {welcomeMsg}
        </Stack>
        )
}

export default HomeScreen;