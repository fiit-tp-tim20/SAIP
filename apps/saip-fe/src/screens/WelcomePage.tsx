import React from "react";
import { useLocation } from "react-router";
// import YouTube from "react-youtube";
import LinkTab from "../components/navbar/LinkTab";

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
			<div className="flex flex-row p-14 top-20 w-screen left-0 z-2 navbar-bg">
				<div className=" w-1/4 mx-8 my-4 custombounce">
					<h2>Simulácia trhu</h2>
					<p>
						"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual
						"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual
						"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual
						"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual
						"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual
						"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual

					</p>
				</div>
				{/*<div className="accent-800-color w-1/2">*/}
				{/*	<YouTube videoId={videoId} opts={opts} />*/}
				{/*</div>*/}
				<div className="w-1/4 mx-8 my-4 custom-bounce">
					<h2>Dôležité informácie</h2>
					<li>Ako správne investovať?</li>
					<li>Kedy zvýšiť cenu produktu?</li>
					<li>Oplatí sa investovať do kapitálu?</li>
					<li>Ako ovplyvní trh inflácia/deflácia?</li>
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-3 py-1 border-t-2 border-accent-700">
				<div className="container mx-auto flex flex-row items-center justify-between">
					<p className="text-center font-medium">Rozpočet:</p>
					<div className="flex gap-8">
						<button type="button" className="button-clear">
							<p placeholder={"mail"}> meno@gmail.com</p>
						</button>
						<button type="button" className="button-clear">
							Pomoc
						</button>
						<button type="button" className="button-clear">

						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WelcomePage;