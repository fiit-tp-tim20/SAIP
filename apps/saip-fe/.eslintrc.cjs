module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["plugin:react/recommended", "airbnb", "airbnb-typescript", "prettier"],
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: "./tsconfig.json",
	},
	plugins: ["react", "prettier"],
	rules: {
		"prettier/prettier": "error",
		"jsx-a11y/label-has-associated-control": "off",
		"jsx-a11y/no-noninteractive-tabindex": "off",
	},
};
