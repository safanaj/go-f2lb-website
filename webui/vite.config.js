import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import devtoolsJson from 'vite-plugin-devtools-json';
// import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const appVersion = readFileSync(fileURLToPath(new URL('version.json', import.meta.url)), 'utf8');

export default defineConfig({
  plugins: [sveltekit(), devtoolsJson(), wasm(), topLevelAwait()],
  build: { minify: false },
  css: { devSourcemap: true },
  define: {
    '__APP_VERSION__': JSON.stringify(appVersion),
  }
});
