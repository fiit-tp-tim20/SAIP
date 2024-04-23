import React, {createContext, Suspense, useContext, useEffect, useState} from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { MyContext } from "./api/MyContext";
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
import WelcomePage from "./screens/WelcomePage";
import Spinner from "./utils/Spinner";
import {useNavigate} from "react-router";
function App() {
	const token = localStorage.getItem("token");
	const currentDate = new Date();
	const exp = localStorage.getItem("expiryDate");
	const [tokenExpired, setTokenExpired] = useState(false)
	// @ts-ignore
	const [isLoading, setIsLoading] = useState(true);
	const [comm, setComm] = useState(false);
	const [connect, setConnect] = useState('')
	const dataWs = useContext(MyContext);
	const [turnNum, setTurnNum] = useState(null);
	useEffect(() => {
		if(exp){
			const exp_date = new Date(exp)
			if (exp_date < currentDate){
				localStorage.removeItem("token")
				localStorage.removeItem("expiryDate")
				console.log("token expired")
				setTokenExpired(true)
			}
		}
	}, [token, comm]);
	const {   sendMessage,
		sendJsonMessage,
		lastMessage,
		lastJsonMessage,
		readyState,
		getWebSocket,} = useWebSocket(`${import.meta.env.VITE_WS_URL}turn_info/`, {
		protocols: ['authorization', `${token}`],
		onMessage: (e) =>{
			console.log(e.data)
			// @ts-ignore
			if (e.data === 'Websocket connected') {
				setConnect('yes');
			}
			if (e.data === 'Company for this user not found') {
				setConnect('Company for this user not found');
			}

			if (e.data[0] === '{' && connect == 'yes') {
				try {
					const receivedData = JSON.parse(e.data);
					setTurnNum(receivedData.Number)
					setComm(receivedData.Committed)
				} catch (error) {
					console.error('Error parsing JSON:', error);
				}
			}
			setIsLoading(false)

		},
		onClose: (event) => {

		},
		share: true,
		shouldReconnect: (closeEvent) => true,
		reconnectAttempts: 1000,
		reconnectInterval: 6000,
	});
	const { reset: resetCompanyState } = useCompanyStore();
	const { reset: resetUpgradeState } = useUpgradesStore();
	const { reset: resetMarketingState } = useMarketingStore();

	const [enableArc] = useState(true);

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
		resetCompanyState();
		resetUpgradeState();
		resetMarketingState();
	}, [comm, turnNum]);
	if (isLoading){
		return <Spinner />;
	}
	if(tokenExpired){
		return (
					<div className="grid items-center">
			<h1 className="flex justify-center mt-10">404</h1>
			<h3 className="flex justify-center my-5">Váš token vypršal, prihláste sa prosím znovu.</h3>
			<button
				className="flex bg-accent-500 hover:bg-accent-700 text-white font-bold rounded-lg mx-40 mt-10"
				type="button"
				onClick={() =>{
					setTokenExpired(false)
					}}
					>Späť na prihlásenie</button>
		</div>
		)
	}

	// kompletne dum-dum riešenie PREROBIŤ. Aj tu aj getTurn() !!!!!!!!!!!!!
	if (token && connect === 'Company for this user not found') {
		return (
			<GameSelect />
		);
	}

	if (turnNum === 0 && token) {
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

	if (token && turnNum != null) {
		return (
			<MyContext.Provider value={{ turnNum, comm, isLoading, setIsLoading, setComm}}>
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
								<Route path="/login" element={<Navigate to="/" replace />} />
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
	if(!token){
		return (
			<MyContext.Provider value={{ turnNum, comm,isLoading, setIsLoading, setComm }}>
				<BrowserRouter>
					<Routes>
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<WelcomePage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</BrowserRouter>
			</MyContext.Provider>
		);
	}

}

export default App;
