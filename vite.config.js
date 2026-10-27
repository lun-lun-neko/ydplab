// vite.config.ts (또는 vite.config.js)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 끝 슬래시가 있어야 import.meta.env.BASE_URL로 만든 경로가 /ydplab/... 가 된다
  base: "/ydplab/",
});
