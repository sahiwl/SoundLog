import axios from 'axios'

// In development mode, prioritize local development URL
// In production mode, use production URL
const baseURL = import.meta.env.DEV 
  ? (import.meta.env.VITE_BE_DEV_URL || 'http://localhost:5001/api')
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

