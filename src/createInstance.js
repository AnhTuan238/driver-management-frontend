import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { refreshToken } from '~/api/authentication';

export const createAxios = (driver, dispatch, stateSuccess) => {
    const newInstance = axios.create();

    newInstance.interceptors.request.use(
        async (config) => {
            if (!driver?.accessToken) {
                return config;
            }

            const decodedToken = jwtDecode(driver.accessToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                const data = await refreshToken();
                const refreshDriver = {
                    ...driver,
                    accessToken: data.accessToken,
                };
                dispatch(stateSuccess(refreshDriver));
                config.headers['token'] = 'Bearer ' + data.accessToken;
            } else {
                config.headers['token'] = 'Bearer ' + driver.accessToken;
            }

            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    return newInstance;
};
