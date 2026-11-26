import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Permintaan /api diteruskan ke backend Express (server.js)
    proxy: { "/api": "http://localhost:3000" },
  },
});
