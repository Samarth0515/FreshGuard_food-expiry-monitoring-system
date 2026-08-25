import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the Food Expiry Tracker React frontend.
// During development, API calls to "/api/*" are proxied to the
// Spring Boot backend running on port 8080. Update the target
// below once your backend port/host is finalized.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
