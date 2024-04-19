import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const backendServer = process.env.REACT_APP_BACKEND_SERVER;

//Axios instance for requests that require a token
const axiosAuthInstance = axios.create({
    baseURL: backendServer
});

// Request interceptor for adding authorization header if token exists
axiosAuthInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('TravellyToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//Axios instance for requests that do not require a token
const axiosPublicInstance = axios.create({
    baseURL: backendServer
})

//Gets current user info from the passed token
export const currentUser = createAsyncThunk('currentUser',
    async (token) => {

        const { username } = jwtDecode(token);
        const response = await axiosAuthInstance.get(`/users/${username}`);
        return response.data;

    });

//Sends a request for user registration
export const registerUser = createAsyncThunk(
    'auth/register',
    async (registerData, { rejectWithValue }) => {
        try {
            const response = await axiosPublicInstance.post(
                `/auth/register`,
                registerData
            )
            //Sets the token to local storage
            localStorage.setItem('TravellyToken', response.token)
            return response.token
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
);

//Sends request to update user data
export const updateUser = createAsyncThunk(
    'auth/update',
    async (updateData, { rejectWithValue }) => {
        try {
            const response = await axiosAuthInstance.put(`/auth/update`, updateData)
            return response.data.updateUser
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

//Sends request to update user password
export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await axiosAuthInstance.put(`/auth/update-password`, passwordData)
            return response.data
        } catch (error) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

//Sends request to authenticate user
export const loginUser = createAsyncThunk(
    'auth/login',
    async (loginData, { rejectWithValue }) => {
        try {
            const { data } = await axiosPublicInstance.post(`/auth/login`,
                loginData)
            //Sets token to local storage
            localStorage.setItem('TravellyToken', data.token)
            return data.token
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    })

//Fetches all upcoming trips for a user - if past is set - fetches all past trips
export const fetchTrips = createAsyncThunk('trips/fetchTrips',
    async (past, { getState, rejectWithValue }) => {
        try {
            const state = getState().auth;
            let url;
            past ? url = `/users/${state.userInfo.username}/trips?q=past` : url = `/users/${state.userInfo.username}/trips`;
            const response = await axiosAuthInstance.get(url);
            return response.data.trips;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }

    });

//Fetches trip by ID
export const fetchTripById = createAsyncThunk('trips/fetchTripById',
    async (id, { rejectWithValue }) => {
        try {
            const url = `/trips/${id}`;
            const response = await axiosAuthInstance.get(url);
            return response.data.trip;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    });

//Sends a request for adding a new trip
export const addNewTrip = createAsyncThunk('trips/addNewTrip',
    async (newTrip, thunkAPI) => {
        try {
            const state = thunkAPI.getState().auth;
            newTrip.username = state.userInfo.username;
            const response = await axiosAuthInstance.post(`/trips`, newTrip);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    });

//Sends a request to edit a trip
export const editTrip = createAsyncThunk('trips/editTrip',
    async ({ form, tripId }, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.put(`/trips/${tripId}`, form);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    });

//Sends a request to delete a trip
export const deleteTrip = createAsyncThunk('trips/deleteTrip',
    async (id, thunkAPI) => {
        try {
            await axiosAuthInstance.delete(`/trips/${id}`);
            return id;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    }
)

//Fetches a day by ID
export const fetchDayById = createAsyncThunk('days/fetchDayById',
    async (id, { rejectWithValue }) => {
        try {
            const url = `/days/${id}`;
            const response = await axiosAuthInstance.get(url);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    });

//Sends a request to the backend to query the external API for trip destinations
export const locationSearch = createAsyncThunk('trips/locationSearch',
    async (query, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.post(`trips/location-search`, query);
            return response.data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    }
)

//Sends a request to the backend to query the external API for places to visit
export const placeSearch = createAsyncThunk('days/placeSearch',
    async (query, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.post(`places/search`, query);
            return response.data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    }
)

//Sends a request to save a selected place in the database
export const placeSave = createAsyncThunk('days/placeSave',
    async (query, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.post(`places`, query);
            return response.data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    }
)

//Sends a request to save a place to a day
export const placeSaveToDay = createAsyncThunk('days/placeSaveToDay',
    async ({ query, dayId }, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.post(`days/${dayId}`, query);
            return response.data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    }
)

//Sends a request to edit time to visit and time of day for a place in a day
export const placeEditToDay = createAsyncThunk('days/placeEditToDay',
    async ({ query, dayId }, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.put(`days/${dayId}`, query);
            return response.data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    }
)

//Sends a request to delete a place from a day
export const placeDeleteFromDay = createAsyncThunk('days/placeDelete',
    async (ids, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.delete(`days/${ids.dayId}/${ids.placeId}`);
            return response.data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return thunkAPI.rejectWithValue(error.response.data.message)
            } else {
                return thunkAPI.rejectWithValue(error.message)
            }
        }
    }
)


