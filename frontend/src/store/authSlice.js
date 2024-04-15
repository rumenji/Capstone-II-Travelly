// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, updateUser, currentUser, changePassword } from '../thunks';


const userToken = localStorage.getItem('TravellyToken')
  ? localStorage.getItem('TravellyToken')
  : null

const initialState = {
  loading: false,
  userInfo: null, // for user object
  userToken, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
  message: "",
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
        localStorage.removeItem('TravellyToken') // deletes token from storage
        state.loading = false
        state.userInfo = null;
        state.userToken = null
        state.error = null
      },
    setCredentials: (state, { payload }) => {
        state.userInfo = payload.user
  },
},
  extraReducers: (builder) => {
    builder
    // register user
        .addCase(registerUser.pending, (state) => {
        state.error = null
        state.loading = true
        })
        .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.success = true // registration successful
        state.loading = false
        state.message = 'Registration is successful! Please log in with your new credentials.'
        })
        .addCase(registerUser.rejected, (state, { payload }) => {
        state.error = payload
        state.loading = false
        })
        // login user
        .addCase(loginUser.pending, (state) => {
            state.error = null
            state.loading = true
        })
        .addCase(loginUser.fulfilled, (state, { payload }) => {
            state.userToken = payload
            state.loading = false
        })
        .addCase(loginUser.rejected, (state, { payload }) => {
            state.error = payload
            state.loading = false
        })
        // update user
        .addCase(updateUser.pending, (state) => {
          state.error = null
          state.loading = true
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
          state.userInfo.first_name = payload.first_name
          state.userInfo.last_name = payload.last_name
          state.userInfo.email = payload.email
          state.message = 'Successfully updated user information.'
          state.loading = false
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
          state.error = payload
          state.loading = false
      })
      // change user password
      .addCase(changePassword.pending, (state) => {
        state.error = null
        state.loading = true
    })
    .addCase(changePassword.fulfilled, (state) => {
        state.message = 'Your password was successfully changed!'
        state.loading = false
    })
    .addCase(changePassword.rejected, (state, { payload }) => {
        state.error = payload
        state.loading = false
    })
        // get current user
        .addCase(currentUser.pending, (state) => {
            state.error = null
            state.loading = true
        })
        .addCase(currentUser.fulfilled, (state, { payload }) => {
            state.userInfo = payload.user
            state.loading = false
        })
        .addCase(currentUser.rejected, (state, { payload }) => {
            state.error = payload ? payload : "Couldn't connect to server! Please refresh the page."
            state.loading = false
        })
    },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer