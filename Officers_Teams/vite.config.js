import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~/components": path.resolve(__dirname, "./src/components"),
      "~/lib": path.resolve(__dirname, "./src/lib"),
    },
  },
  server: {
    port: 5001,
  },
});
