import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { hiber3DVitePlugin } from "@hiber3d/web/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss(), hiber3DVitePlugin()],
  publicDir: "assets",
});
