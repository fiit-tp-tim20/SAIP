import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./i18n";
import Sandbox from "./screens/Sandbox";
import Plan from "./screens/Plan";
import Devtools from "./dev/Devtools";
import Product from "./screens/Product";
import Navbar from "./components/Navbar"

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<Navbar />
				<BrowserRouter>
					<Routes>
						<Route path="/plan" element={<Plan />} />
						<Route path="/news" element={<p>Novinky</p>} />
						<Route path="/sandbox" element={<Sandbox />} />
						<Route path="/product" element={<Product />} />
						<Route path="/" element={<Navigate to="/plan" replace />} />
						<Route path="*" element={<p>404</p>} />
					</Routes>
				</BrowserRouter>
			</Suspense>
			<Devtools />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
