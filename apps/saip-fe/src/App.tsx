import React, { Suspense, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./i18n";
import { useAtom } from "jotai";
import Dashboard from "./screens/Dashboard";
import Product from "./screens/Product";
import Navbar from "./components/navbar/Navbar";
import Company from "./screens/Company";
import Marketing from "./screens/Marketing";
import BottomBar from "./components/bottombar/BottomBar";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import useCompanyStore from "./store/Company";
import useUpgradesStore from "./store/Upgrades";
import useMarketingStore from "./store/Marketing";
import logout from "./api/logout";
import GameSelect from "./screens/GameSelect";
import Register from "./screens/Register";
import BugReport from "./components/bugreport/BugReport";
import { currentTurn } from "./store/Atoms";

function App() {
	const token = localStorage.getItem("token");
	const [data, setData] = useState(null);
	useEffect(() => {
		// @ts-ignore
		const chatSocket = new WebSocket("ws://team23-23.studenti.fiit.stuba.sk/ws/turn_info/", ["token", token]);
		chatSocket.onmessage = function (e) {
			// @ts-ignore
			console.log(e.data);
			const receivedData = JSON.parse(e.data);
			localStorage.setItem("committed", receivedData.Committed);
			setData(receivedData);

			// document.querySelector('#chat-log').value += (e.data + '\n');
		};
		chatSocket.onclose = function (e) {
			console.error("Chat socket closed unexpectedly");
		};
		// eslint-disable-next-line
	}, [])

	const { reset: resetCompanyState } = useCompanyStore();
	const { reset: resetUpgradeState } = useUpgradesStore();
	const { reset: resetMarketingState } = useMarketingStore();

	const [enableArc] = useState(true);

	const [, setTurn] = useAtom(currentTurn);

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
			localStorage.setItem("committed", data.Committed);
		}
		if (savedTurn && data && data.Number !== parseInt(savedTurn, 10)) {
			localStorage.setItem("committed", data.Committed);
			localStorage.setItem("turn", data.Number);
			resetCompanyState();
			resetUpgradeState();
			resetMarketingState();
		}

		setTurn(data?.Number || -1);
	}, [data]);

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

	if (token) {
		return (
			<Suspense>
				<BrowserRouter>
					<Navbar />
					<div className="my-16">
						<Routes>
							<Route path="/product" element={<Product />} />
							<Route path="/company" element={<Company />} />
							<Route path="/marketing" element={<Marketing />} />
							<Route path="/game" element={<GameSelect />} />
							<Route path="/" element={<Dashboard />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
					<BottomBar />
					<BugReport />
				</BrowserRouter>
			</Suspense>
		);
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route path="/" element={<Login />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
