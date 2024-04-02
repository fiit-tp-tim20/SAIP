import React from "react";
import { useLocation } from "react-router";
// import YouTube from "react-youtube";
import LinkTab from "../components/navbar/LinkTab";
import Canvas from "../components/three/Canvas";

function WelcomePage() {
	const videoId = "JlcOTUQPSPI";
	const location = useLocation();
	const opts = {
		height: "360",
		width: "100%",
		playerVars: {
			// Options for the YouTube player
		},
	};
	const tabs = [
		{
			title: "Prihlásenie",
			path: "/login",
		},
		{
			title: "Registrácia",
			path: "/register",
		},
	];
	return (
		<div className="flex">
			<div className="flex flex-row w-screen fixed top-0 left-0 z-40 navbar-bg">
				<p className="px-10 py-4 text-3xl align-middle font-bold accent-800-color leading-[20px]">SAIP</p>
				<div className="flex flex-row items-center justify-end w-screen">
					<ul className="flex flex-row p-0 m-0">
						{tabs.map((tab) => (
							<LinkTab
								key={tab.path}
								title={tab.title}
								path={tab.path}
								isActive={tab.path === location.pathname}
							/>
						))}
					</ul>
				</div>
			</div>
			<div className="flex flex-row p-14 top-20 w-screen left-0 z-2 navbar-bg h-screen border-4">
				<div className="w-1/4 mx-8 my-4 custom-bounce">
					<h2>Simuláciou sa naučíš</h2>
					<li>Ako správne investovať?</li>
					<li>Kedy zvýšiť cenu produktu?</li>
					<li>Oplatí sa investovať do kapitálu?</li>
					<li>Ako ovplyvní trh inflácia/deflácia?</li>
					<li>Čo znamená segmentácia trhu a ako ju využiť vo svoj prospech?</li>
					<li>Kedy je vhodné investovať do výskumu a vývoja?</li>
					<li>Ako sa v podniku využíva dlhodobý hmotný majetok a ako sa mení jeho hodnota?</li>
					<li>Ako pracovať s hlavnými výkazmi podniku ako súvaha, výkaz ziskov a strát a výkaz o peňažnom toku?</li>
				</div>
				<div className=" w-1/2 h-1/2 place-self-auto">
					<Canvas />
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-3 py-4 border-t-2 border-accent-700">
				<div className="container mx-auto flex flex-row items-center justify-between">
					<p className="text-right font-medium">Vyvinuté v spolupráci so študentmi FIIT STU </p>
					<div className="flex gap-8">
						Ivan Katrenčík
						<button type="button" className="button-clear">
							<p placeholder={"mail"}>katrencikivan@gmail.com</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WelcomePage;