import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    outDir: path.resolve(__dirname, "../static/ui"),
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "AwesomeIinaCatalogUi",
      formats: ["es"],
      fileName: () => "catalog-ui.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "catalog-ui.[ext]",
      },
    },
  },
});
