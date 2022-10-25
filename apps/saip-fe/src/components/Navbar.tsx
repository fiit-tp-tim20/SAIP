import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "react-feather";
import LinkTab from "./LinkTab";

function Navbar() {
	const { t } = useTranslation();

	const tabs = [
		{
			title: t("plan.title") as string,
			path: "/plan",
			isActive: false,
		},
		{
			title: t("product.title") as string,
			path: "/product",
			isActive: false,
		},
	];

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
