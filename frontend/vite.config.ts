import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // historyApiFallback: true,
    // Vite serves index.html for unknown routes in dev (SPA / React Router).
    // Proxy API requests during development to the backend server.
    // Requests starting with "/api" will be forwarded to the backend on port 5001.
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
