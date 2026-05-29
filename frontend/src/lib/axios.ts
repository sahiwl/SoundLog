import axios, { type AxiosInstance } from "axios";

// Dev: Vite proxy. Prod: Vercel rewrite (vercel.json) — same-origin /api so JWT cookies work.
const baseURL = "/api";

/** Shared client — use .get<T>() / .post<T>() with shapes from src/types/ */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
