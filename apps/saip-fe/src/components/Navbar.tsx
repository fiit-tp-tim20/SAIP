import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "react-feather";
import LinkTab from "./LinkTab";
import { useLocation } from "react-router";

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
	]);

	useEffect(() => {
		setTabs((tabs) =>
			tabs.map((tab) => ({
				...tab,
				title: t(`${tab.name}.title`) as string,
			})),
		);
	}, [i18n.language]);

	useEffect(() => {
		setTabs((tabs) =>
			tabs.map((tab) => ({
				...tab,
				isActive: tab.path === location.pathname,
			})),
		);
	}, [location]);

	return (
		<div className="navbar bg-gray-100 top-0 w-screen fixed left-0">
			<a href="/" className="btn btn-primary btn-ghost normal-case text-xl">
				SAIP
			</a>
			<ul className="menu menu-horizontal p-0 m-0">
				{tabs.map((tab) => (
					<LinkTab
						key={tab.title}
						title={tab.title}
						path={tab.path}
						isActive={tab.isActive}
						icon={<X size={16} />}
					/>
				))}
			</ul>
		</div>
	);
}

export default Navbar;
