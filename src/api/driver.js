import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllDrivers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/show/stored/drivers`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDetailDriver = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/drivers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllDriversInTrash = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/show/trash/drivers`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addDriver = async (values, accessToken, axiosJWT) => {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('emailAddress', values.emailAddress);
    formData.append('idDriver', values.idDriver);
    formData.append('country', values.country);
    formData.append('city', values.city);
    formData.append('phone', values.phone);
    formData.append('dateOfBirth', values.dateOfBirth);
    formData.append('zone', values.zone);
    formData.append('password', values.password);
    formData.append('admin', values.admin);
    formData.append('licensePlate', values.licensePlate);
    if (values.avatar) {
        formData.append('avatar', values.avatar);
    }

    try {
        const response = await axiosJWT.post(`${BASE_URL}/drivers`, formData, {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateDriver = async (id, values, accessToken, axiosJWT) => {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('password', values.password);
    formData.append('emailAddress', values.emailAddress);
    formData.append('idDriver', values.idDriver);
    formData.append('country', values.country);
    formData.append('city', values.city);
    formData.append('phone', values.phone);
    formData.append('dateOfBirth', values.dateOfBirth);
    formData.append('zone', values.zone);
    formData.append('admin', values.admin);
    formData.append('licensePlate', values.licensePlate);
    if (values.avatar) {
        formData.append('avatar', values.avatar);
    }

    try {
        const response = await axiosJWT.put(`${BASE_URL}/drivers/${id}`, formData, {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const restoreDriver = async (id, accessToken, axiosJWT) => {
    try {
        await axiosJWT.patch(`${BASE_URL}/drivers/${id}/restore`, {
            headers: { token: `Bearer ${accessToken}` },
        });
    } catch (error) {
        throw error;
    }
};

export const softDeleteDriver = async (id, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.delete(`${BASE_URL}/drivers/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forceDeleteDriver = async (id, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.delete(`${BASE_URL}/drivers/${id}/force-delete`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
