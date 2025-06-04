import { createSlice } from '@reduxjs/toolkit';

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        login: {
            currentDriver: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentDriver = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentDriver = null;
            state.login.error = false;
        },
        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutStart: (state) => {
            state.login.isFetching = true;
        },
    },
});
export const { loginStart, loginSuccess, loginFailed, logoutStart, logoutSuccess, logoutFailed } =
    authenticationSlice.actions;
export default authenticationSlice.reducer;
