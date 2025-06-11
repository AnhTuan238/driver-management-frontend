import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const chatWithAI = async (question) => {
    try {
        const response = await axios.post(`${BASE_URL}/chat`, { question });
        return response;
    } catch (error) {
        throw error;
    }
};
