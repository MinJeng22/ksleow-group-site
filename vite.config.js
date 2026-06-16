import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.gif"],
  build: {
    rollupOptions: {
      preserveEntrySignatures: "strict",
      output: {
        entryFileNames: isSsrBuild ? "entry-server.cjs" : "assets/[name]-[hash].js",
        format: isSsrBuild ? "cjs" : undefined,
      },
    },
  },
}));