import React, { Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./i18n";
import Dashboard from "./screens/Dashboard";
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
import GameSelect from "./screens/GameSelect";
import Register from "./screens/Register";
import BugReport from "./components/bugreport/BugReport";
import { getCommitted } from "./api/GetCommitted";
import { useAtom } from "jotai";
import { currentTurn } from "./store/Atoms";

function App() {
	const token = localStorage.getItem("token");
	const { data } = useQuery({
		queryKey: ["currentTurn"],
		queryFn: () => token && getTurn(),
		refetchInterval: 1000,
	});

	const { reset: resetCompanyState } = useCompanyStore();
	const { reset: resetUpgradeState } = useUpgradesStore();
	const { reset: resetMarketingState } = useMarketingStore();

	const { data: committed, refetch: refetchCommited } = useQuery("committed", () => getCommitted());

	const [enableArc, setEnableArc] = React.useState(true);

	const [turn, setTurn] = useAtom(currentTurn);

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--secondary",
			enableArc ? "var(--arc-palette-foregroundSecondary)" : "",
		);
		document.documentElement.style.setProperty(
			"--primary",
			enableArc ? "var(--arc-palette-foregroundPrimary)" : "",
		);
		document.documentElement.style.setProperty(
			"--tertiary",
			enableArc ? "var(--arc-palette-foregroundTertiary)" : "",
		);
		document.documentElement.style.setProperty(
			"--maxContrastColor",
			enableArc ? "var(--arc-palette-maxContrastColor)" : "",
		);
		document.documentElement.style.setProperty(
			"--minContrastColor",
			enableArc ? "var(--arc-palette-minContrastColor)" : "",
		);
		document.documentElement.style.setProperty("--hover", enableArc ? "var(--arc-palette-hover)" : "");
	}, [enableArc]);

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
			refetchCommited();
			resetCompanyState();
			resetUpgradeState();
			resetMarketingState();
		}

		setTurn(data?.Number || -1);
	}, [data && data.Number]);

	// kompletne dum-dum riešenie PREROBIŤ. Aj tu aj getTurn() !!!!!!!!!!!!!
	if (token && !data) {
		return <GameSelect />;
	}

	if (data && data.Number === 0) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<h1 className="text-4xl font-bold pb-4">Hra sa ešte nezačala</h1>
				<button
					type="button"
					className="button-dark font-bold py-2 px-4 m-0 rounded-lg"
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
								<Route path="/game" element={<GameSelect />} />
								{/* <Route path="/news" element={<News />} /> */}
								{/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
								<Route path="/" element={<Dashboard />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</div>
						<BottomBar />
						<BugReport />
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
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</>
	);
}

export default App;
