import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import LinkTab from "./LinkTab";

function Navbar() {
	const { t } = useTranslation();
	const location = useLocation();

	const tabs = ["plan", "product", "news", "sandbox"];

	return (
		<div className="navbar top-0 w-screen fixed left-0 z-50">
			<p className="px-8 normal-case text-xl">SAIP</p>
			<ul className="menu menu-horizontal p-0 m-0">
				{tabs.map((tab) => (
					<LinkTab
						key={tab}
						title={t(`${tab}.title`) as string}
						path={`/${tab}`}
						isActive={`/${tab}` === location.pathname}
					/>
				))}
			</ul>
		</div>
	);
}

export default Navbar;
