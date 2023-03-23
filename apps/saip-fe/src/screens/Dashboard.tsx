import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CompanyReport from "../components/reports/companyReport";
import IndustryReport from "../components/reports/industryReport";

function Plan() {
	const { t } = useTranslation();

	const [showCompanyReport, setShowCompanyReport] = useState(true);

	const handleSwitchScreen = () => {
		setShowCompanyReport(!showCompanyReport);
	};

	return (
		<div>
			{showCompanyReport ? (
				<button
					className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 m-0 rounded-lg"
					onClick={handleSwitchScreen}
				>
					Prejsť na správu o trhu
				</button>
			) : (
				<button
					className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 m-0 rounded-lg"
					onClick={handleSwitchScreen}
				>
					Prejsť na správu o spoločnosti
				</button>
			)}
			{showCompanyReport ? <CompanyReport /> : <IndustryReport />}
		</div>
	);
}

export default Plan;
