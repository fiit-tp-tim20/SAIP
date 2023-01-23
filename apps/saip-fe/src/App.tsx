import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./i18n";
import Dashboard from "./screens/Dashboard";
import News from "./screens/News";
import Devtools from "./dev/Devtools";
import Product from "./screens/Product";
import Navbar from "./components/navbar/Navbar";
import Company from "./screens/Company";
import Marketing from "./screens/Marketing";
import Login from "./screens/Login";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<BrowserRouter>
					<Navbar />
					<div className="mt-16">
						<Routes>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/product" element={<Product />} />
							<Route path="/company" element={<Company />} />
							<Route path="/marketing" element={<Marketing />} />
							<Route path="/news" element={<News />} />
							<Route path="/" element={<Navigate to="/login" replace />} />
							<Route path="*" element={<Login />} />
							<Route path="/login" element={<Login />} />
						</Routes>
					</div>
				</BrowserRouter>
			</Suspense>
			{/* <Devtools /> */}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
