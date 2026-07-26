import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    token: null,
    username: null,
    role: null,
    isVerified: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.isVerified = Boolean(action.payload.isVerified);
        },
        setVerified: (state) => {
            state.isVerified = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = null;
            state.role = null;
            state.isVerified = false;
        },
    },
});

export const { login, logout, setVerified } = authSlice.actions;

export default authSlice.reducer;
