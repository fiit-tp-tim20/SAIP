import React from "react";
import { useTranslation } from "react-i18next";

function Plan() {
	const { t } = useTranslation();

	return (
		<div className="w-[1280px]">
			<h1 className="p-6">{t("dashboard.title") as string}</h1>
			<div className="grid grid-cols-3 gap-6">
				<div className="flex flex-col grow background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>{t("dashboard.resources.title") as string}</h2>
						<h5 className="pt-1">37 000€</h5>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("dashboard.resources.available") as string}</h3>
						<p className="pt-1">10 000€</p>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("dashboard.resources.credit") as string}</h3>
						<p className="pt-1">27 000€</p>
					</div>
				</div>

				<div className="flex flex-col grow background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>{t("dashboard.expenses.title") as string}</h2>
						<h5 className="pt-1">19 000€</h5>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("dashboard.expenses.salary") as string}</h3>
						<p className="pt-1">19 000€</p>
					</div>
				</div>

				<div className="flex flex-col grow background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>{t("dashboard.production.title") as string}</h2>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("dashboard.production.cpm") as string}</h3>
						<p className="pt-1">18,18€</p>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("dashboard.production.utilization") as string}</h3>
						<p className="pt-1">75%</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Plan;
