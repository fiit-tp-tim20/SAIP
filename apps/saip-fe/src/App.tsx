import React, {createContext, Suspense, useContext, useEffect, useState} from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// @ts-ignore
import { MyContext } from "./api/MyContext.js";
// @ts-ignore
import { ConnectContext } from "./api/ConnectContext.js";
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
import { io } from "socket.io-client"
// @ts-ignore

function App() {
	const token = localStorage.getItem("token");
	const [connect, setConnect] = useState('yes')
	const value = { connect, setConnect };
	const dataWs = useContext(MyContext);
	const [data, setData] = useState({
		num: null,
		comm: null,
		start:  null
	});
	useEffect(() => {
		const socket = io('ws://localhost:8000', {
			path: "/ws/turn_info/",
			transports: ['websocket'],
			query: { token: token }
		});
		socket.on("Data", (data: any) => {
			console.log(data)
		});
	}, []);
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
		// @ts-ignore
		const savedTurn = dataWs.num
		if (!savedTurn && !data) {
			//localStorage.setItem("turn", "0");
		}
		if (!savedTurn && data) {
			//localStorage.setItem("turn", data.Number);
			//localStorage.setItem("committed", data.Committed);
		}
		if (savedTurn && data && data.num !== parseInt(savedTurn, 10)) {
			//localStorage.setItem("committed", data.Committed);
			//localStorage.setItem("turn", data.Number);
			resetCompanyState();
			resetUpgradeState();
			resetMarketingState();
		}

		setTurn(data?.num || -1);
	}, [data]);

	// kompletne dum-dum riešenie PREROBIŤ. Aj tu aj getTurn() !!!!!!!!!!!!!
	if (token && data.num === null) {
		return (
			<ConnectContext.Provider value={value}>
				<GameSelect />
			</ConnectContext.Provider>
		);
	}

	if (data && data.num === 0) {
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
			<MyContext.Provider value={data}>
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
			</MyContext.Provider>

		);
	}

	return (
		<MyContext.Provider value={data}>
			<BrowserRouter>
				<Routes>
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Login />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</MyContext.Provider>

	);
}

export default App;
