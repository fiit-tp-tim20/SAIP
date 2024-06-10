import React, { useContext, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import LinkTab from "./LinkTab";
import Profile from "./Profile";

// @ts-ignore
import { MyContext } from "../../api/MyContext";

function Navbar() {
	const { t } = useTranslation();
	const location = useLocation();
	const dataWs = useContext(MyContext);
	// @ts-ignore
	const data = dataWs.turnNum;
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const tabs = [
		{
			title: "Dashboard",
			path: "/",
		},
		{
			title: t("production_sales.title"),
			path: "/company",
		},
		{
			title: t("research.title"),
			path: "/product",
		},
		{
			title: "Marketing",
			path: "/marketing",
		},
	];

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		setDropdownOpen(false); // Close the dropdown after selecting a language
	};

	return (
		<div className="flex flex-row p-2 top-0 w-screen fixed left-0 z-40 navbar-bg">
			<Link to="/">
				<p className="px-8 normal-case text-xl align-middle font-bold accent-800-color leading-[40px]">SAIP</p>
			</Link>
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
					<div className="relative">
						<button
							className="button-dark py-2 px-4 m-0 rounded-lg text-black"
							onClick={() => setDropdownOpen(!dropdownOpen)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-1 inline-block"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 2C5.03 2 1 6.03 1 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16a7 7 0 100-14 7 7 0 000 14zm2-7a2 2 0 11-4 0 2 2 0 014 0z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
						{dropdownOpen && (
							<div className="absolute right-0 mt-2 w-24 rounded">
								<button
									className="rounded w-full py-2 px-4 text-left text-black button-dark hover:bg-green-400"
									onClick={() => changeLanguage("sk")}
								>
									sk
								</button>
								<button
									className="rounded w-full py-2 px-4 text-left text-black button-dark hover:bg-green-400"
									onClick={() => changeLanguage("en")}
								>
									en
								</button>
							</div>
						)}
					</div>
					<p className="m-auto">
						{" "}
						{t("misc.round") as string} {data}
					</p>
					<Profile />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
