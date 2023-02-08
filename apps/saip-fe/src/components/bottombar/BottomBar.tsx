import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { getGeneralInfo } from "../../api/CompanyInfo";
import { totalSpentPersist } from "../../store/Atoms";
import useCompanyStore from "../../store/Company";
import useMarketingStore from "../../store/Marketing";

export default function BottomBar() {
	const { isLoading, data } = useQuery("companyInfo", () => getGeneralInfo());

	const { getSum: getSumMarketing, getChecked: getCheckedMarketing } = useMarketingStore();
	const { getSum: getSumCompany, getChecked: getCheckedCompany } = useCompanyStore();

	const navigate = useNavigate();

	const [totalSpent, setTotalSpent] = useAtom(totalSpentPersist);

	useEffect(() => {
		setTotalSpent(0 + getSumCompany() + getSumMarketing());
	}, [getSumCompany(), getSumMarketing()]);

	return (
		<div className="fixed bottom-2 right-2 z-40">
			{!isLoading ? (
				<div className="bg-white px-3 py-1 rounded-lg border-2 border-accent-700">
					<div className="flex flex-row gap-8 items-center">
						<p className={`text-center font-medium ${totalSpent > data.budget_cap ? "text-red-600" : ""}`}>
							Budget: {totalSpent}/{data.budget_cap}€
						</p>
						<button onClick={() => navigate("/product")} className="button-clear">
							{/* TODO create state */}
							Produkt: {false ? "✅" : "❌"}
						</button>
						<button onClick={() => navigate("/company")} className="button-clear">
							Spoločnosť: {getCheckedCompany() ? "✅" : "❌"}
						</button>
						<button onClick={() => navigate("/marketing")} className="button-clear">
							Marketing: {getCheckedMarketing() ? "✅" : "❌"}
						</button>
						<button
							onClick={() => alert("Ukončenie kola!")}
							className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-accent-100 disabled:cursor-not-allowed"
							disabled={totalSpent > data.budget_cap || !getCheckedCompany() || !getCheckedMarketing()}
						>
							Ukončiť kolo
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
