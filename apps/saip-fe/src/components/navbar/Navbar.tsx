import React, {useContext} from "react";
import { useLocation } from "react-router";
import LinkTab from "./LinkTab";
import Profile from "./Profile";
// @ts-ignore
import  {MyContext}  from "..//../api/MyContext.js";
function Navbar() {
	const location = useLocation();

	const dataWs = useContext(MyContext);
	// @ts-ignore
	const data = dataWs.num

	const tabs = [
		{
			title: "Dashboard",
			path: "/",
		},
		{
			title: "Výroba a predaj",
			path: "/company",
		},
		{
			title: "Výskum a vývoj",
			path: "/product",
		},
		{
			title: "Marketing",
			path: "/marketing",
		},
	];

	return (
		<div className="flex flex-row p-2 top-0 w-screen fixed left-0 z-40 navbar-bg">
			<p className="px-8 normal-case text-xl align-middle font-bold accent-800-color leading-[40px]">SAIP</p>
			<div className="flex flex-row justify-between w-screen">
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
				<div className="flex flex-row gap-3 pr-3">
					<p className="m-auto">Kolo {data}</p>
					<Profile />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
