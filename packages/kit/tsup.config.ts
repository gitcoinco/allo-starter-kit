import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  ...options,
  treeshake: false,
  splitting: false,
  bundle: false,
  entry: ["src"],
  format: ["esm"],
  dts: false,
  minify: !options.watch,
  experimentalDts: true,
  clean: true,
  external: ["react"],
}));
