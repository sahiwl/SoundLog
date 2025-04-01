import axios from 'axios'

const baseURL = import.meta.env.VITE_BE_URL;

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

