import axios from 'axios'

// Dev: relative /api so JWT cookies stay same-origin (Vite proxy → backend)
const baseURL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_BE_PROD_URL ||
     import.meta.env.VITE_BE_ALT_URL ||
     import.meta.env.VITE_BE_DEV_URL)

if (import.meta.env.DEV) {
    console.log('Axios baseURL:', baseURL);
}

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

