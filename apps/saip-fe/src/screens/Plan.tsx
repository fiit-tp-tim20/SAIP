import React from "react";
import { useTranslation } from "react-i18next";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { renderCustomizedLabel } from "../utils/graphUtils";

const COLORS = ["#ADEFD1", "#00203F"];

function Plan() {
	const { t } = useTranslation();

	const cash_data = [
		{ name: t("plan.resources.available") as string, value: 10000 },
		{ name: t("plan.resources.credit") as string, value: 27000 },
	];

	const expenses_data = [{ name: t("plan.expenses.salary") as string, value: 19000 }];

	return (
		<div className="flex flex-col justify-center">
			<h1 className="p-6">{t("plan.title") as string}</h1>
			<div className="flex flex-row max-w-7xl min-w-[60rem] py-2">
				<div className="flex flex-col grow background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>{t("plan.resources.title") as string}</h2>
						<h5 className="pt-1">37 000€</h5>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("plan.resources.available") as string}</h3>
						<p className="pt-1">10 000€</p>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("plan.resources.credit") as string}</h3>
						<p className="pt-1">27 000€</p>
					</div>
				</div>
				<div>
					<PieChart width={250} height={250}>
						<Pie
							data={cash_data}
							cx="50%"
							cy="50%"
							labelLine={false}
							// label={renderCustomizedLabel}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							{cash_data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Legend />
						<Tooltip />
					</PieChart>
				</div>
			</div>
			<div className="flex flex-row max-w-7xl min-w-[60rem] py-2">
				<div className="flex flex-col grow background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>{t("plan.expenses.title") as string}</h2>
						<h5 className="pt-1">19 000€</h5>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("plan.expenses.salary") as string}</h3>
						<p className="pt-1">19 000€</p>
					</div>
				</div>
				<div>
					<PieChart width={250} height={250}>
						<Pie
							data={expenses_data}
							cx="50%"
							cy="50%"
							labelLine={false}
							// label={renderCustomizedLabel}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							<Cell key={`cell-0`} fill={COLORS[0]} />
							<Cell key={`cell-1`} fill={COLORS[1]} />
						</Pie>
						<Legend />
						<Tooltip />
					</PieChart>
				</div>
			</div>
			<div className="flex flex-row max-w-7xl min-w-[60rem] py-2">
				<div className="flex flex-col grow background-container p-6 rounded-2xl">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>{t("plan.production.title") as string}</h2>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("plan.production.cpm") as string}</h3>
						<p className="pt-1">18,18€</p>
					</div>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("plan.production.utilization") as string}</h3>
						<p className="pt-1">75%</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Plan;
