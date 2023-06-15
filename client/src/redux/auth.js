import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        loggedIn: false,
        user: null,
        accessToken: null
    },
    reducers: {
        logIn: (state, action) => {
            state.loggedIn = true,
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
        },
        logOut: (state) => {
            state.loggedIn = false,
            state.user = null,
            state.accessToken = null
        },
    }
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;