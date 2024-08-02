import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  ...options,
  treeshake: false,
  splitting: true,
  bundle: false,
  entry: ["src"],
  format: ["cjs", "esm"],
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
