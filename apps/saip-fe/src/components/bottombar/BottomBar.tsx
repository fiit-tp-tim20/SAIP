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
		// center horizontally the bottom bar
		<div className="fixed bottom-2 right-2 z-40">
			{!isLoading ? (
				<div className="bg-white p-3 rounded-lg border-2 border-accent-700">
					<div className="flex flex-row gap-8">
						<p className="text-center font-medium">
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
					</div>
				</div>
			) : null}
		</div>
	);
}
