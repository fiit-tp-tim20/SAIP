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
					primary: "#ADEFD1",
					secondary: "#00203F",
					accent: "#b0fcae",
					neutral: "#9333ea",
					"base-100": "#f3f4f6",
					info: "#2FAFF4",
					success: "#4BB543",
					warning: "#f97316",
					error: "#F22E1C",
				},
			},
		],
	},
};
