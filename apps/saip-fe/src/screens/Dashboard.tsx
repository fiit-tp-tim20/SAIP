import React, {useContext, useEffect, useState} from "react";

import CompanyReport from "../components/reports/CompanyReport";
import IndustryReport from "../components/reports/IndustryReport";
import ArchiveReport from "../components/reports/ArchiveReport";
// @ts-ignore
import  {MyContext}  from "../api/MyContext";
import { useTranslation } from "react-i18next";
import {func} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

function Plan() {
	const { t } = useTranslation();
	const [showCompanyReport, setShowCompanyReport] = useState(true);
	const [showIndustryReport, setShowIndustryReport] = useState(false);
	const [showArchiveReport, setShowArchiveReport] = useState(false);
	// @ts-ignore
	const data = useContext(MyContext);
	// @ts-ignore
	const currentTurn = data.turnNum
	// @ts-ignore
	useEffect(() => {
		// @ts-ignore
		if (currentTurn === 1) {
			setShowCompanyReport(true);
		}
	}, [data]);
	return (
		<div className="flex flex-col items-center">
			<div className="inline-flex rounded-md shadow-sm pt-4" role="group">
				<button
					type="button"
					className={`font-bold py-2 px-4 m-0 rounded-l-lg transition-all duration-300 ${
						showCompanyReport ? "button-group-colors-active" : "border button-group-colors"
					}`}
					onClick={function (){
						setShowArchiveReport(false);
						setShowIndustryReport(false);
						setShowCompanyReport(true);
					}}
				>
					{t("dashboard.company_report.title") as string}
				</button>
				<button
					type="button"
					className={`font-bold py-2 px-4 m-0 transition-all duration-300 disabled:text-gray-300 disabled:border-gray-300 disabled:hover:bg-white ${
						showIndustryReport ? "button-group-colors-active" : "border button-group-colors"
					}
                    `}
					onClick={function (){
						setShowArchiveReport(false);
						setShowCompanyReport(false);
						setShowIndustryReport(true);
					}}
					disabled={currentTurn === 1}
				>
					{t("dashboard.industry_report.title") as string}
				</button>
				<button
					type="button"
					className={`font-bold py-2 px-4 m-0 rounded-r-lg transition-all duration-300 disabled:text-gray-300 disabled:border-gray-300 disabled:hover:bg-white ${
						showArchiveReport ? "button-group-colors-active" : "border button-group-colors"
					}
                    `}
					onClick={function (){
						setShowArchiveReport(true);
						setShowCompanyReport(false);
						setShowIndustryReport(false);
					}}
					disabled={currentTurn === 1}
				>
					{t("dashboard.decision_archive.title") as string}
				</button>
			</div>

			{showCompanyReport && <CompanyReport />}
			{showIndustryReport && <IndustryReport />}
			{showArchiveReport && <ArchiveReport />}
		</div>
	);
}

export default Plan;
