import React, { useEffect, useState } from "react";

import CompanyReport from "../components/reports/CompanyReport";
import IndustryReport from "../components/reports/IndustryReport";

function Plan() {
	const [showCompanyReport, setShowCompanyReport] = useState(true);
	// @ts-ignore
	const currentTurn = parseInt(localStorage.getItem("turn"), 10);
	console.log(currentTurn);

	useEffect(() => {
		// @ts-ignore
		if (currentTurn === 1) {
			setShowCompanyReport(true);
		}
	}, [currentTurn]);
	return (
		<div className="flex flex-col items-center">
			<div className="inline-flex rounded-md shadow-sm pt-4" role="group">
				<button
					type="button"
					className={`font-bold py-2 px-4 m-0 rounded-l-lg transition-all duration-300 ${
						showCompanyReport ? "button-group-colors-active" : "border button-group-colors"
					}`}
					onClick={() => setShowCompanyReport(true)}
				>
					Správa o spoločnosti
				</button>
				<button
					type="button"
					className={`font-bold py-2 px-4 m-0 rounded-r-lg transition-all duration-300 disabled:text-gray-300 disabled:border-gray-300 disabled:hover:bg-white ${
						!showCompanyReport ? "button-group-colors-active" : "border button-group-colors"
					}
                    `}
					onClick={() => setShowCompanyReport(false)}
					disabled={currentTurn === 1}
				>
					Správa o trhu
				</button>
			</div>

			{showCompanyReport ? <CompanyReport /> : <IndustryReport />}
		</div>
	);
}

export default Plan;
