import { sveltekit } from "@sveltejs/kit/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), wasm(), topLevelAwait()],
  build: { minify: true }
};

export default config;
