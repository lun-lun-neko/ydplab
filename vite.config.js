// vite.config.ts (또는 vite.config.js)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ✅ 리포 이름과 정확히 일치
  base: "/ydplab/",
});
