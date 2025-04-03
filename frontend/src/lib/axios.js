import axios from 'axios'

// Priority order:
// 1. VITE_BE_PROD_URL (highest)
// 2. VITE_BE_ALT_URL
// 3. VITE_BE_DEV_URL (fallback)
const baseURL = import.meta.env.VITE_BE_PROD_URL || 
                import.meta.env.VITE_BE_ALT_URL || 
                import.meta.env.VITE_BE_DEV_URL

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

