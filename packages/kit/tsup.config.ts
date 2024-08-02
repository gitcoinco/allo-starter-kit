import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  ...options,
  treeshake: true,
  splitting: false,
  bundle: false,
  entry: ["src"],
  format: ["esm"],
  dts: true,
  minify: !options.watch,
  clean: true,
  external: ["react"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
}));
