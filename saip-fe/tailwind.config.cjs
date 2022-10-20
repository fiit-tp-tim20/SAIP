/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: "#cdadf4",
					secondary: "#ffdfcc",
					accent: "#b0fcae",
					neutral: "#9333ea",
					"base-100": "#f3f4f6",
					info: "#2FAFF4",
					success: "#0F7157",
					warning: "#B96913",
					error: "#F22E1C",
				},
			},
		],
	},
};
