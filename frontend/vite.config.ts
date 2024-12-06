import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { DynamicPublicDirectory } from "vite-multiple-assets";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    DynamicPublicDirectory(
      ["public/**", { input: "../game/assets/**", output: "/assets" }],
      {
        ssr: false,
        mimeTypes: {
          ".glb": "application/glb",
          ".png": "image/png",
        },
      }
    ),
  ],
  server: {
    fs: {
      allow: [".."],
    },
  },
});
