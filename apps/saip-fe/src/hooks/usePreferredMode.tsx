import React, { useState } from "react";

function usePreferredMode() {
	const [mode, setMode] = useState<"light" | "dark">("light");

	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", (e) => setMode(e.matches ? "dark" : "light"));

	return { mode };
}

export default usePreferredMode;
