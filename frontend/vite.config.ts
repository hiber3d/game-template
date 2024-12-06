import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { DynamicPublicDirectory } from "vite-multiple-assets";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
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
