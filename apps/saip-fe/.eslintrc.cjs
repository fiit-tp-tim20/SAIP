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
		"react/no-unknown-property": "off",
		"react/require-default-props": "off",
		"react/jsx-props-no-spreading": "off",
        "no-bitwise": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
	},
};
