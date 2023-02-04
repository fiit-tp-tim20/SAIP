import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import LinkTab from "./LinkTab";
import Profile from "./Profile";

function Navbar() {
	const { t } = useTranslation();
	const location = useLocation();

	const tabs = ["dashboard", "product", "company", "marketing", "news"];

	//! just for testing, find a better place to do this
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("expiryDate");
		window.location.reload();
	};

	return (
		<div className="flex flex-row p-2 top-0 w-screen fixed left-0 z-40 border-b-2 border-b-accent-700 bg-white">
			<p className="px-8 normal-case text-xl align-middle font-bold text-accent-800 leading-[40px]">SAIP</p>
			<div className="flex flex-row justify-between w-screen">
				<ul className="flex flex-row p-0 m-0">
					{tabs.map((tab) => (
						<LinkTab
							key={tab}
							title={t(`${tab}.title`) as string}
							path={`/${tab}`}
							isActive={`/${tab}` === location.pathname}
						/>
					))}
				</ul>
				<div className="pr-3">
					<Profile />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
