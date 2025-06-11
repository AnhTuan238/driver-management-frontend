import axios from 'axios';

import {
    loginStart,
    loginSuccess,
    loginFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed,
} from '~/redux/authenticationSlice';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginRequest = async (driver, dispatchEvent) => {
    dispatchEvent(loginStart());
    try {
        const response = await axios.post(`${BASE_URL}/authentication/login`, driver, { withCredentials: true });
        dispatchEvent(loginSuccess(response.data));
    } catch (error) {
        dispatchEvent(loginFailed());
        throw error;
    }
};

export const logoutRequest = async (driver, dispatch, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post(`${BASE_URL}/authentication/logout`, driver, {
            withCredentials: true,
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logoutSuccess());
    } catch (err) {
        dispatch(logoutFailed());
    }
};

export const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${BASE_URL}/authentication/refresh`,
            {},
            {
                withCredentials: true,
            },
        );
        return res.data;
    } catch (err) {
        console.log('Refresh token failed:', err);
    }
};
