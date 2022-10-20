import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/plan" element={<div>Plán</div>} />
				<Route path="/news" element={<p>Novinky</p>} />
				<Route path="/sandbox" element={<p>UI Lib</p>} />
				<Route path="/" element={<Navigate to="/plan" replace />} />
				<Route path="*" element={<p>404</p>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
