import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  treeshake: false,
  splitting: false,
  entry: ["src"],
  format: ["esm"],
  dts: false,
  minify: !options.watch,
  clean: true,
  external: ["react"],
  ...options,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
}));
