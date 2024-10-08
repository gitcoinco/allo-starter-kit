import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  ...options,
  treeshake: false,
  splitting: false,
  bundle: false,
  entry: ["src"],
  format: ["esm"],
  dts: false,
  minify: false,
  experimentalDts: false,
  clean: true,
  external: ["react", "react-dom", "wagmi", "@rainbow-me/rainbowkit"],
}));
