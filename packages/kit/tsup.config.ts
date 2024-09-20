import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  ...options,
  treeshake: true,
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
