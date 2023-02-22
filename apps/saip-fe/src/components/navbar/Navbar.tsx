import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import { getTurn } from "../../api/GetTurn";
import LinkTab from "./LinkTab";
import Profile from "./Profile";

function Navbar() {
	const { t } = useTranslation();
	const location = useLocation();

	const { data, isLoading } = useQuery({
		queryKey: ["currentTurn"],
		queryFn: () => getTurn(),
	});

	const tabs = ["dashboard", "product", "company", "marketing"];

	return (
		<div className="flex flex-row p-2 top-0 w-screen fixed left-0 z-40 bg-white">
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
					<p>{data.Number}</p>
					<Profile />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
