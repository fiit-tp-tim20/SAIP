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
import logout from "./api/logout";
import Register from "./screens/Register";

function App() {
	const token = localStorage.getItem("token");
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["currentTurn"],
		queryFn: () => token && getTurn(),
		refetchInterval: 1000,
	});

	const { reset: resetCompanyState } = useCompanyStore();
	const { reset: resetUpgradeState } = useUpgradesStore();
	const { reset: resetMarketingState } = useMarketingStore();

	useEffect(() => {
		const savedTurn = localStorage.getItem("turn");
		if (!savedTurn && !data) {
			localStorage.setItem("turn", "0");
		}
		if (!savedTurn && data) {
			localStorage.setItem("turn", data.Number);
		}
		if (savedTurn && data && data.Number !== parseInt(savedTurn, 10)) {
			localStorage.setItem("turn", data.Number);
			resetCompanyState();
			resetUpgradeState();
			resetMarketingState();
		}
	}, [data && data.Number]);

	if (data && data.Number === 0) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<h1 className="text-4xl font-bold pb-2">Hra sa ešte nezačala</h1>
				<button
					type="button"
					className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 m-0 rounded-lg"
					onClick={() => logout(resetMarketingState, resetCompanyState, resetUpgradeState)}
				>
					Odhlásiť sa
				</button>
			</div>
		);
	}

	return (
		<>
			{token ? (
				<Suspense>
					<BrowserRouter>
						<Navbar />
						<div className="my-16">
							<Routes>
								<Route path="/product" element={<Product />} />
								<Route path="/company" element={<Company />} />
								<Route path="/marketing" element={<Marketing />} />
								{/* <Route path="/news" element={<News />} /> */}
								{/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
								<Route path="/" element={<Dashboard />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</div>
						<BottomBar />
					</BrowserRouter>
				</Suspense>
			) : (
				<BrowserRouter>
					<Routes>
						<Route path="/register" element={<Register />} />
						<Route path="/" element={<Login />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</BrowserRouter>
			)}
			{/* <Devtools /> */}
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
}

export default App;
