import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Tutorial from "../modal/Tutorial";
import getCompanyReport from "../../api/GetCompanyReport";
import numberWithSpaces from "../../utils/numberWithSpaces";
import { useTranslation } from "react-i18next";
// @ts-ignore
import { MyContext } from "../../api/MyContext";

function CompanyReport() {
	const { t } = useTranslation();
	const {numberShow, setNumberShow} = useContext(MyContext);
	const dataWs = useContext(MyContext);
	const TURN = dataWs.turnNum;
	const { isLoading, data } = useQuery(["companyReport", numberShow], () => getCompanyReport(numberShow));

	// State for managing tutorial visibility
	const [isTutorialOpen, setTutorialOpen] = useState<boolean>(true);

	// State for managing tutorial visibility
	const [tutorialStates, setTutorialStates] = useState({
		production: false,
		balance: false,
		cashflow: false,
		incomeStatement: false,
		sales: false,
		balance_tip: false,
	});

	const openTutorial = (tutorialKey: string) => {
		setTutorialStates((prevStates) => ({
			...prevStates,
			[tutorialKey]: true,
		}));
	};

	const closeTutorial = (tutorialKey: string) => {
		setTutorialStates((prevStates) => ({
			...prevStates,
			[tutorialKey]: false,
		}));
	};
	const downloadCsv = (csvString: BlobPart) => {
		const blob = new Blob([csvString], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'company_report.csv');
		document.body.appendChild(link);
		link.click();
		link.remove();
	};
	const convertJsonToCsv = (jsonArray: any[]) => {
		if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
			return '';
		}

		const rows = [];

		// Add headers from the first object in the array
		// const headers = Object.keys(jsonArray[0]).map((key) => {
		// 	if (typeof jsonArray[0][key] === 'object') {
		// 		return Object.keys(jsonArray[0][key]).map((subKey) => `${key}.${subKey}`).join(',');
		// 	}
		// 	return key;
		// }).flat().join(',');

		// Set headers using translations
		const headers = t("dashboard.industry_report.prod_report.quantity") + "," + t("dashboard.industry_report.prod_report.max_capacity") + "," + t("dashboard.industry_report.prod_report.coef_utilisation") + "," + t("dashboard.industry_report.prod_report.cost") + "," + t("dashboard.industry_report.prod_report.stocks") + "," + t("dashboard.industry_report.prod_report.total_cost") + "," + t("dashboard.industry_report.sales_report.orders_recieved") + "," + t("dashboard.industry_report.sales_report.orders_fulfilled") + "," + t("dashboard.industry_report.sales_report.orders_unfulfilled") + "," + t("dashboard.industry_report.sales_report.selling_price") + "," + t("dashboard.industry_report.balance_sheet.funds") + "," + t("dashboard.industry_report.balance_sheet.stocks") + "," + t("dashboard.industry_report.balance_sheet.long_assets") + "," + t("dashboard.industry_report.balance_sheet.sum_assets") + "," + t("dashboard.industry_report.balance_sheet.loans") + "," + t("dashboard.industry_report.balance_sheet.previous") + "," + t("dashboard.industry_report.balance_sheet.capital") + "," + t("dashboard.industry_report.balance_sheet.sum_liab") + "," + t("dashboard.industry_report.cashflow.initial") + "," + t("dashboard.industry_report.cashflow.revenue") + "," + t("dashboard.industry_report.cashflow.expen_products") + "," + t("dashboard.industry_report.cashflow.expen_stock_additional") + "," + t("dashboard.industry_report.cashflow.expen_stock") + "," + t("dashboard.industry_report.cashflow.expen_decision") + "," + t("dashboard.industry_report.cashflow.expen_interest") + "," + t("dashboard.industry_report.cashflow.tax") + "," + t("dashboard.industry_report.cashflow.result_flow") + "," + t("dashboard.industry_report.cashflow.new_loans") + "," + t("dashboard.industry_report.cashflow.loan_repay") + "," + t("dashboard.industry_report.cashflow.final") + "," + t("dashboard.industry_report.profit_loss.sales") + "," + t("dashboard.industry_report.profit_loss.cost_sold") + "," + t("dashboard.industry_report.profit_loss.cost_marketing") + "," + t("dashboard.industry_report.profit_loss.cost_rnd") + "," + t("dashboard.industry_report.profit_loss.deductions") + "," + t("dashboard.industry_report.profit_loss.cost_management") + "," + t("dashboard.industry_report.profit_loss.cost_upgrade") + "," + t("dashboard.industry_report.profit_loss.overcharge_upgrade") + "," + t("dashboard.industry_report.profit_loss.interest") + "," + t("dashboard.industry_report.profit_loss.before_tax") + "," + t("dashboard.industry_report.profit_loss.tax") + "," + t("dashboard.industry_report.profit_loss.after_tax") + "," + t("misc.round")

		rows.push(headers);

		// Add values for each object in the array
		jsonArray.forEach(json => {
			const values = Object.values(json).map((value) => {
				if (typeof value === 'object') {
					// @ts-ignore
					return Object.values(value).join(',');
				}
				return value;
			}).flat().join(',');

			rows.push(values);
		});

		return rows.join('\n');
	};

	const exportToCSV = async () => {
		const csv_merge = []
		try {
			for (let i = 0; i <= numberShow; i++) {
				let response = await getCompanyReport(i);

				response = { ...response, turn: i };
				csv_merge.push(response)
			}
			const csvString = convertJsonToCsv(csv_merge);
			downloadCsv(csvString);

		} catch (error) {
			console.error('Failed to fetch data for CSV export:', error);
		}
	};


	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<div className="flex flex-row justify-between">
				<h1 className="my-4">{t("dashboard.industry_report.title") as string}</h1>
				<div>
					<button
						onClick={exportToCSV}
						className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
					>
						Export to CSV
					</button>
					<label htmlFor="turn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">
						Pre kolo
					</label>
					<select
						id="turn"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:cursor-pointer"
						value={numberShow}
						onChange={(e) => {
							setNumberShow(parseInt(e.target.value, 10));
						}}
					>
						{[...Array(TURN).keys()].map((o) => {
							if (o === 0) return null;
							return <option value={o}>{o}</option>;
						})}
					</select>
				</div>
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<div className="grid gap-4 xl:grid-cols-2">
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.industry_report.prod_report.title") as string}</h2>
							{/* Add a button to open the tutorial */}
							<button
								onClick={() => openTutorial("production")}
								className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
							>
								?
							</button>
							{tutorialStates.production && (
								<Tutorial
									isOpen={tutorialStates.production}
									closeModal={() => closeTutorial("production")}
									textTitle={`${t("dashboard.industry_report.prod_report.title")}`}
									textContent={
										<div>
											<h5>{t("dashboard.industry_report.prod_report.coef_utilisation") as string}</h5>
											<p>{t("dashboard.industry_report.prod_report.tutorial.text1") as string}</p>

											<br />
											<b>{t("dashboard.industry_report.prod_report.tutorial.example") as string}</b> <br />
											<p style={{ fontSize: "14px" }}>
												{t("dashboard.industry_report.prod_report.tutorial.text2") as string}
												<br />
												<br />
												{t("dashboard.industry_report.prod_report.tutorial.text3") as string}
												<br />
												<br />
												{t("dashboard.industry_report.prod_report.tutorial.text4") as string}{" "}
												<br />
												<br />
												{t("dashboard.industry_report.prod_report.tutorial.text5") as string}{" "}
											</p>
											<br />
											<h5>{t("dashboard.industry_report.prod_report.cost") as string}</h5>
											<p>
												{t("dashboard.industry_report.prod_report.tutorial.text6") as string}{" "}
											</p>
											<br />
											<h5>{t("dashboard.industry_report.prod_report.total_cost") as string}</h5>
											<p>
												= {t("dashboard.industry_report.prod_report.cost") as string}
												<br />
												+ {t("dashboard.industry_report.profit_loss.deductions") as string}
												<br />
												+ {t("dashboard.industry_report.profit_loss.cost_marketing") as string}
												<br />
												+ {t("dashboard.industry_report.prod_report.tutorial.interest_loan") as string}
												<br />
												+ {t("dashboard.industry_report.profit_loss.cost_upgrade") as string}
												<br />
												+ {t("dashboard.industry_report.prod_report.tutorial.text7") as string}
												<br />+ {t("dashboard.industry_report.profit_loss.cost_rnd") as string}
											</p>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.prod_report.quantity") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production?.production)} ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.prod_report.max_capacity") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.capacity)} ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.prod_report.coef_utilisation") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.utilization)} %
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.prod_report.cost") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.man_cost)} €/ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.prod_report.stocks") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.new_inventory)} ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.prod_report.total_cost") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.man_cost_all)} €/ks
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.industry_report.sales_report.title") as string}</h2>
							{/* Add a button to open the tutorial */}
							<button
								onClick={() => openTutorial("sales")}
								className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
							>
								💡
							</button>
							{tutorialStates.sales && (
								<Tutorial
									isOpen={tutorialStates.sales}
									closeModal={() => closeTutorial("sales")}
									textTitle={`${t("dashboard.industry_report.sales_report.title")} 💡`}
									textContent={
										<div>
											{t("dashboard.industry_report.sales_report.tip.text1") as string}
											<br />
											<br />
											{t("dashboard.industry_report.sales_report.tip.text2") as string}
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.sales_report.orders_recieved") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_received)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.sales_report.orders_fulfilled") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_fulfilled)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.sales_report.orders_unfulfilled") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_unfulfilled)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.sales_report.selling_price") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.selling_price)} €/ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.sales_report.ros") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(
											Math.round(
												(data?.income_statement.net_profit / data?.income_statement.sales) *
													100 *
													100,
											) / 100,
										)}{" "}
										%
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.sales_report.roa") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(
											Math.round(
												(data?.income_statement.net_profit / data?.balance.assets_summary) *
													100 *
													100,
											) / 100,
										)}{" "}
										%
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.industry_report.balance_sheet.title") as string}</h2>
							<div>
								{/* Add a button to open the tutorial */}
								<button
									onClick={() => openTutorial("balance")}
									className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
								>
									?
								</button>
								{tutorialStates.balance && (
									<Tutorial
										isOpen={tutorialStates.balance}
										closeModal={() => closeTutorial("balance")}
										textTitle={`${t("dashboard.industry_report.balance_sheet.title")}`}
										textContent={
											<div>
												<h5>{t("dashboard.industry_report.balance_sheet.funds") as string}</h5>
												= {t("dashboard.industry_report.balance_sheet.tutorial.text1") as string} <br />
												<i>
													{t("dashboard.industry_report.balance_sheet.tutorial.text2") as string}
												</i>
												<br />
												<br />
												<h5>{t("dashboard.industry_report.balance_sheet.long_assets") as string}</h5>
												= {t("dashboard.industry_report.balance_sheet.tutorial.text3") as string}
												<br />
												<i>{t("dashboard.industry_report.balance_sheet.tutorial.text4") as string}</i>
												<br />
												<br />
												<h5>{t("dashboard.industry_report.balance_sheet.stocks") as string}</h5>{t("dashboard.industry_report.balance_sheet.tutorial.text5") as string} <br />
												<br />
												<h5>{t("dashboard.industry_report.balance_sheet.previous") as string}</h5>
												{t("dashboard.industry_report.balance_sheet.tutorial.text6") as string}
												<br />
												<br />
												<h5>{t("dashboard.industry_report.balance_sheet.capital") as string}</h5>
												{t("dashboard.industry_report.balance_sheet.tutorial.text7") as string}
												<br />
											</div>
										}
									/>
								)}
								<button
									onClick={() => openTutorial("balance_tip")}
									className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
								>
									💡
								</button>
								{tutorialStates.balance_tip && (
									<Tutorial
										isOpen={tutorialStates.balance_tip}
										closeModal={() => closeTutorial("balance_tip")}
										textTitle={`${t("dashboard.industry_report.balance_sheet.title")} 💡`}
										textContent={
											<div>
												{t("dashboard.industry_report.balance_sheet.tip.text1") as string}
											</div>
										}
									/>
								)}
							</div>
						</div>
						<table className="table-auto table-white">
							<thead>
								<tr>
									<th className="px-4 py-2 bg-white">{t("dashboard.industry_report.balance_sheet.assets") as string}</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.balance_sheet.funds") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.cash)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.balance_sheet.stocks") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.inventory_money)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.balance_sheet.long_assets") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.capital_investments)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.industry_report.balance_sheet.sum_assets") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap font-bold">
										{numberWithSpaces(data?.balance.assets_summary)} €
									</td>
								</tr>
							</tbody>
							<thead>
								<tr>
									<th className="px-4 py-2 bg-white">{t("dashboard.industry_report.balance_sheet.liabilities") as string}</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.balance_sheet.loans") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.loans)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.balance_sheet.previous") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.ret_earnings)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.balance_sheet.capital") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.base_capital)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.industry_report.balance_sheet.sum_liab") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap font-bold">
										{numberWithSpaces(data?.balance.liabilities_summary)} €
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Cashflow</h2>
							{/* Add a button to open the tutorial */}
							<button
								onClick={() => openTutorial("cashflow")}
								className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
							>
								?
							</button>
							{tutorialStates.cashflow && (
								<Tutorial
									isOpen={tutorialStates.cashflow}
									closeModal={() => closeTutorial("cashflow")}
									textTitle="Cashflow"
									textContent={
										<div>
											<h5>{t("dashboard.industry_report.cashflow.expen_stock") as string}</h5>
											= {t("dashboard.industry_report.cashflow.tutorial.text1") as string} <br />
											<br />
											<h5>{t("dashboard.industry_report.cashflow.expen_decision") as string}</h5>
											= {t("dashboard.industry_report.cashflow.tutorial.text2") as string} <br />
											<br />
											<h5>{t("dashboard.industry_report.cashflow.expen_interest") as string}</h5>
											= {t("dashboard.industry_report.cashflow.tutorial.text3") as string} <br />
											<br />
											<h5>{t("dashboard.industry_report.cashflow.initial") as string}</h5>
											= {t("dashboard.industry_report.cashflow.tutorial.text4") as string} <br />
											<br />
											<h5>{t("dashboard.industry_report.cashflow.final") as string}</h5>
											= {t("dashboard.industry_report.cashflow.tutorial.text5") as string}
											<br />
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.initial") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.beginning_cash)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.revenue") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.sales)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.expen_products") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.manufactured_man_cost)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.expen_stock") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.inventory_charge_all)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.expen_decision") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.expenses)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.expen_interest") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.interest)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.tax") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.tax)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.industry_report.cashflow.result_flow") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.cash_flow.cash_flow_result)} €</b>
									</td>
								</tr>
								{data?.cash_flow.new_loans > 0 ? (
									<tr>
										<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.new_loans") as string}</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{numberWithSpaces(data?.cash_flow.new_loans)} €
										</td>
									</tr>
								) : (
									<tr>
										<td className="px-4 py-2">{t("dashboard.industry_report.cashflow.loan_repay") as string}</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{numberWithSpaces(data?.cash_flow.loan_repayment)} €
										</td>
									</tr>
								)}
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.industry_report.cashflow.final") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.cash_flow.cash)} €</b>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.industry_report.profit_loss.title") as string}</h2>
							{/* Add a button to open the tutorial */}
							<button
								onClick={() => openTutorial("incomeStatement")}
								className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
							>
								?
							</button>
							{tutorialStates.incomeStatement && (
								<Tutorial
									isOpen={tutorialStates.incomeStatement}
									closeModal={() => closeTutorial("incomeStatement")}
									textTitle={`${t("dashboard.industry_report.profit_loss.title")}`}
									textContent={
										<div>
											<h5>{t("dashboard.industry_report.profit_loss.cost_sold") as string}</h5>
											= {t("dashboard.industry_report.profit_loss.tutorial.text1") as string} <br />
											{t("dashboard.industry_report.profit_loss.tutorial.text2") as string} <br />
											<br />
											<h5>{t("dashboard.industry_report.profit_loss.deductions") as string}</h5>
											= {t("dashboard.industry_report.balance_sheet.long_assets") as string} * 0,0125
											<br />
											<i>{t("dashboard.industry_report.profit_loss.tutorial.text3") as string}</i>
											<br />
											<br />
											<h5>{t("dashboard.industry_report.profit_loss.cost_management") as string}</h5>
											= {t("dashboard.industry_report.profit_loss.tutorial.text4") as string}

											<br />
											<br />
											<h5>{t("dashboard.industry_report.profit_loss.cost_upgrade") as string}</h5>
											<i>
												{t("dashboard.industry_report.profit_loss.tutorial.text5") as string}{" "}
											</i>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.sales") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.sales)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.cost_sold") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.manufactured_man_cost)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.cost_marketing") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.marketing)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.cost_rnd") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.r_d)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.deductions") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.depreciation)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.cost_management") as string}</td>

									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.inventory_charge)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.cost_upgrade") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.inventory_upgrade)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.interest") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.interest)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.industry_report.profit_loss.before_tax") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.income_statement.profit_before_tax)} €</b>
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.industry_report.profit_loss.tax") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.tax)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.industry_report.profit_loss.after_tax") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.income_statement.net_profit)} €</b>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}

export default CompanyReport;
