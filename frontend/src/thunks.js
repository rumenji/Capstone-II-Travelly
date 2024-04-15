import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const backendServer = process.env.REACT_APP_BACKEND_SERVER;

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

const axiosPublicInstance = axios.create({
    baseURL: backendServer
})

export const currentUser = createAsyncThunk('currentUser',
    async (token) => {
      
            const { username } = jwtDecode(token);
            const response = await axiosAuthInstance.get(`/users/${username}`);
            return response.data;
        
    });

export const registerUser = createAsyncThunk(
    'auth/register',
    async (registerData, { rejectWithValue }) => {
        try {
        const response = await axiosPublicInstance.post(
            `/auth/register`,
            registerData
        )
        localStorage.setItem('TravellyToken', response.token)
        return response.token
        } catch (error) {
        // return custom error message from backend if present
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message)
        } else {
            return rejectWithValue(error.message)
        }
        }
    }
    );

export const updateUser = createAsyncThunk(
    'auth/update',
    async (updateData, {rejectWithValue}) => {
        try{
            const response = await axiosAuthInstance.put(`/auth/update`, updateData)
            return response.data.updateUser
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

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, {rejectWithValue}) => {
        try{
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

export const loginUser = createAsyncThunk(
    'auth/login',
    async (loginData, {rejectWithValue}) => {
        try{
            const {data} = await axiosPublicInstance.post(`/auth/login`,
            loginData)
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

export const fetchTrips = createAsyncThunk('trips/fetchTrips', 
    async (past,{getState, rejectWithValue}) => {
        try{
            console.log('Fetching trips')
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

export const fetchTripById = createAsyncThunk('trips/fetchTripById', 
    async (id,{rejectWithValue}) => {
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

export const addNewTrip = createAsyncThunk('trips/addNewTrip',
    async (newTrip, thunkAPI) => {
        try{
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

    export const editTrip = createAsyncThunk('trips/editTrip',
    async ({form, tripId}, thunkAPI) => {
        try{
            console.log(tripId)
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

export const fetchDayById = createAsyncThunk('days/fetchDayById', 
    async (id,{rejectWithValue}) => {
        try {
            console.log('getting day')
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

export const locationSearch = createAsyncThunk('trips/locationSearch',
    async (query, thunkAPI) => {
        try {
            const response = await axiosAuthInstance.post(`trips/location-search`, query);
            console.log(response.data)
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

export const placeSearch = createAsyncThunk('days/placeSearch',
async (query, thunkAPI) => {
    try {
        console.log(query)
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

export const placeSave = createAsyncThunk('days/placeSave',
async (query, thunkAPI) => {
    try {
        const response = await axiosAuthInstance.post(`places`, query);
        console.log(response.data)
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

export const placeSaveToDay = createAsyncThunk('days/placeSaveToDay',
async ({query, dayId} , thunkAPI) => {
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

export const placeEditToDay = createAsyncThunk('days/placeEditToDay',
async ({query, dayId} , thunkAPI) => {
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


