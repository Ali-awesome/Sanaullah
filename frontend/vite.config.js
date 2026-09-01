import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Vercel/Netlify serve from a domain root ("/"), so the default is
  // correct there. A GitHub Pages *project* site is served from
  // "/<repo-name>/" instead — set VITE_BASE_PATH="/<repo-name>/" only
  // when building for that target (the included Pages workflow does this).
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
  },
});
