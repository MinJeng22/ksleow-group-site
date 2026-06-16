import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.gif"],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: isSsrBuild ? "entry-server.js" : "assets/[name]-[hash].js",
      },
    },
  },
}));