import React from "react";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/plan",
		element: <div>Plán</div>,
	},
	{
		path: "/news",
		element: <p>Novinky</p>,
	},
]);

export default router;
