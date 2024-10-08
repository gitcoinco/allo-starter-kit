import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { glob } from "glob";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ exclude: ["src/**/*.mdx", "src/**/*.stories.@(js|jsx|mjs|ts|tsx)"] })],
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    copyPublicDir: false,
    outDir: "dist",
    assetsDir: "assets",
    cssCodeSplit: false,
    minify: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@rainbow-me/rainbowkit", "wagmi"],
      output: {
        assetFileNames: "styles.css",
        entryFileNames: "[name].mjs",
      },
    },
  },
});
