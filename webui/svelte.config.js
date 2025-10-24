import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: { adapter: adapter() },
  vitePlugin: {
	inspector: {
	  showToggleButton: 'active'
	}
  }
};

export default config;
