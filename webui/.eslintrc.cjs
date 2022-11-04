module.exports = {
	root: true,
	extends: ['eslint:recommended'],
	plugins: ['svelte3'],
	overrides: [
    { files: ['*.svelte'], processor: 'svelte3/svelte3' },
    { files: ['**/CardanoConnect.svelte'], rules: {"no-prototype-builtins": "off"} },
    { files: ['**/routes/+layout.svelte'], rules: {"no-undef": "off", "missing-declaration": "off"} }
    ],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
