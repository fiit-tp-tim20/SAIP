import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Sandbox from "./screens/Sandbox";
import "./i18n";

function App() {
	return (
		<Suspense>
			<BrowserRouter>
				<Routes>
					<Route path="/plan" element={<div>Plán</div>} />
					<Route path="/news" element={<p>Novinky</p>} />
					<Route path="/sandbox" element={<Sandbox />} />
					<Route path="/" element={<Navigate to="/plan" replace />} />
					<Route path="*" element={<p>404</p>} />
				</Routes>
			</BrowserRouter>
		</Suspense>
	);
}

export default App;
