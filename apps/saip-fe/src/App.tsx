import React, { Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./i18n";
import Dashboard from "./screens/Dashboard";
import News from "./screens/News";
import Devtools from "./dev/Devtools";
import Product from "./screens/Product";
import Navbar from "./components/navbar/Navbar";
import Company from "./screens/Company";
import Marketing from "./screens/Marketing";
import BottomBar from "./components/bottombar/BottomBar";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { getTurn } from "./api/GetTurn";
import useCompanyStore from "./store/Company";
import useUpgradesStore from "./store/Upgrades";
import useMarketingStore from "./store/Marketing";

function App() {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["currentTurn"],
		queryFn: () => getTurn(),
		refetchInterval: 1000,
	});
	const token = localStorage.getItem("token");

	const { reset: resetCompanyState } = useCompanyStore();
	const { reset: resetUpgradeState } = useUpgradesStore();
	const { reset: resetMarketingState } = useMarketingStore();

	useEffect(() => {
		const savedTurn = localStorage.getItem("turn");
		if (!savedTurn) {
			localStorage.setItem("turn", data.Number);
		}
		if (savedTurn && data && data.Number !== parseInt(savedTurn, 10)) {
			localStorage.setItem("turn", data.Number);
			resetCompanyState();
			resetUpgradeState();
			resetMarketingState();
		}
	}, [data && data.Number]);

	return (
		<>
			{token ? (
				<Suspense>
					<BrowserRouter>
						<Navbar />
						<div className="my-16">
							<Routes>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/product" element={<Product />} />
								<Route path="/company" element={<Company />} />
								<Route path="/marketing" element={<Marketing />} />
								{/* <Route path="/news" element={<News />} /> */}
								<Route path="/" element={<Navigate to="/dashboard" replace />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</div>
						<BottomBar />
					</BrowserRouter>
				</Suspense>
			) : (
				<Login />
			)}
			{/* <Devtools /> */}
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
}

export default App;
