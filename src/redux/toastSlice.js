import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
    name: 'toast',
    initialState: [],
    reducers: {
        addToast: (state, action) => {
            const id = Date.now();
            const toast = { id, ...action.payload };
            state.push(toast);
            if (state.length > 2) state.shift();
        },
        removeToast: (state, action) => {
            return state.filter((toast) => toast.id !== action.payload);
        },
    },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
