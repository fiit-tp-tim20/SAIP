import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import LinkTab from "./LinkTab";

function Navbar() {
	const { t, i18n } = useTranslation();
	const location = useLocation();

	const [tabs, setTabs] = useState([
		{
			name: "plan",
			title: t("plan.title") as string,
			path: "/plan",
			isActive: false,
		},
		{
			name: "product",
			title: t("product.title") as string,
			path: "/product",
			isActive: false,
		},
		{
			name: "news",
			title: t("news.title") as string,
			path: "/news",
			isActive: false,
		},
		{
			name: "sandbox",
			title: t("sandbox.title") as string,
			path: "/sandbox",
			isActive: false,
		},
	]);

	useEffect(() => {
		setTabs((_tabs) =>
			_tabs.map((tab) => ({
				...tab,
				title: t(`${tab.name}.title`) as string,
			})),
		);
	}, [i18n.language]);

	useEffect(() => {
		setTabs((_tabs) =>
			_tabs.map((tab) => ({
				...tab,
				isActive: tab.path === location.pathname,
			})),
		);
	}, [location]);

	return (
		<div className="navbar top-0 w-screen fixed left-0 z-50">
			<p className="px-8 normal-case text-xl">SAIP</p>
			<ul className="menu menu-horizontal p-0 m-0">
				{tabs.map((tab) => (
					<LinkTab key={tab.title} title={tab.title} path={tab.path} isActive={tab.isActive} />
				))}
			</ul>
		</div>
	);
}

export default Navbar;
