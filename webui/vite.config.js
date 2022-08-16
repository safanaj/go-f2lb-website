import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { sveltekit } from "@sveltejs/kit/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const appVersion = readFileSync(fileURLToPath(new URL('version.json', import.meta.url)), 'utf8');


/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), wasm(), topLevelAwait()],
  build: { minify: true },

  define: {
    '__APP_VERSION__': JSON.stringify(appVersion),
  }
};

export default config;
