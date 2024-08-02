import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  ...options,
  treeshake: false,
  splitting: true,
  bundle: true,
  entry: ["src"],
  format: ["esm"],
  dts: false,
  minify: !options.watch,
  experimentalDts: true,
  clean: true,
  external: ["react"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
}));
