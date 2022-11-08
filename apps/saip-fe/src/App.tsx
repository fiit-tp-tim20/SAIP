import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./i18n";
import Sandbox from "./screens/Sandbox";
import Plan from "./screens/Plan";
import News from "./screens/News";
import Devtools from "./dev/Devtools";
import Product from "./screens/Product";
import Navbar from "./components/navbar/Navbar";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<BrowserRouter>
					<Navbar />
					<div className="mt-16">
						<Routes>
							<Route path="/plan" element={<Plan />} />
							<Route path="/news" element={<News />} />
							<Route path="/sandbox" element={<Sandbox />} />
							<Route path="/product" element={<Product />} />
							<Route path="/" element={<Navigate to="/plan" replace />} />
							<Route path="*" element={<p>404</p>} />
						</Routes>
					</div>
				</BrowserRouter>
			</Suspense>
			<Devtools />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
