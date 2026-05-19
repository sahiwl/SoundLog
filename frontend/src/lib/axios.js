import axios from "axios";

// Dev: Vite proxy. Prod: Vercel rewrite (vercel.json) — same-origin /api so JWT cookies work.
const baseURL = "/api";

if (import.meta.env.DEV) {
  console.log("Axios baseURL:", baseURL);
}

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
