import { createSlice } from '@reduxjs/toolkit';

const driverSlice = createSlice({
    name: 'driver',
    initialState: {
        drivers: {
            allDrivers: null,
            isFetching: false,
            error: false,
        },
        msg: '',
    },
    reducers: {
        getDriversStart: (state) => {
            state.drivers.isFetching = true;
        },
        getDriversSuccess: (state, action) => {
            state.drivers.isFetching = false;
            state.drivers.allDrivers = action.payload;
        },
        getDriversFailed: (state) => {
            state.drivers.isFetching = false;
            state.drivers.error = true;
        },
        deleteDriversStart: (state) => {
            state.drivers.isFetching = true;
        },
        deleteDriversSuccess: (state, action) => {
            state.drivers.isFetching = false;
            state.msg = action.payload;
        },
        deleteDriversFailed: (state, action) => {
            state.drivers.isFetching = false;
            state.drivers.error = true;
            state.msg = action.payload;
        },
    },
});

export const {
    getDriversStart,
    getDriversSuccess,
    getDriversFailed,
    deleteDriversStart,
    deleteDriversSuccess,
    deleteDriversFailed,
} = driverSlice.actions;
export default driverSlice.reducer;
