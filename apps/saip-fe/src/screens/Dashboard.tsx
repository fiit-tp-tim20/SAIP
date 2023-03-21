import React, { useState } from "react";
import CompanyReport from "../components/reports/companyReport";
import IndustryReport from "../components/reports/industryReport";

function Plan() {
	const [showCompanyReport, setShowCompanyReport] = useState(true);

	const handleSwitchScreen = () => {
		setShowCompanyReport(!showCompanyReport);
	};

	return (
		<div>
			{showCompanyReport ? (
				<button
					className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 m-0 rounded-lg"
					type="button"
					onClick={handleSwitchScreen}
				>
					Prejsť na správu o trhu
				</button>
			) : (
				<button
					className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 m-0 rounded-lg"
					type="button"
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
