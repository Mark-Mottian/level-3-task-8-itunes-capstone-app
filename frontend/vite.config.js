import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* <=== VITE CONFIGURATION ===> */

export default defineConfig({
  /*
   * The React plugin allows Vite to compile and serve React components.
   */
  plugins: [react()],

  server: {
    proxy: {
      /*
       * During development, React runs on localhost:5173 and Express runs on localhost:5000.
       * This proxy lets the frontend call /api routes without hard-coding the backend URL.
       */
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
