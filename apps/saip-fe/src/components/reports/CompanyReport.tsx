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
	const dataWs = useContext(MyContext);
	// @ts-ignore
	const TURN = dataWs.turnNum;
	// @ts-ignore
	const [turn, setTurn] = useState<number>(dataWs.turnNum - 1);
	const { isLoading, data } = useQuery(["companyReport", turn], () => getCompanyReport(turn));

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

	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<div className="flex flex-row justify-between">
				<h1 className="my-4">{t("dashboard.company_report.title") as string}</h1>
				<div>
					<label htmlFor="turn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">
						{t("dashboard.for_round") as string}
					</label>
					<select
						id="turn"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:cursor-pointer"
						value={turn}
						onChange={(e) => setTurn(parseInt(e.target.value, 10))}
					>
						{[...Array(TURN).keys()].map((o) => (
							<option value={o}>{o}</option>
						))}
					</select>
				</div>
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<div className="grid gap-4 xl:grid-cols-2">
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.company_report.prod_report.title") as string}</h2>
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
									textTitle={`${t("dashboard.company_report.prod_report.title")}`}
									textContent={
										<div>
											<h5>{t("dashboard.company_report.prod_report.coef_utilisation") as string}</h5>
											<p>{t("dashboard.company_report.prod_report.tutorial.text1") as string}</p>
											<br />
											<b>{t("dashboard.company_report.prod_report.tutorial.example") as string}</b> <br />
											<p style={{ fontSize: "14px" }}>
												{t("dashboard.company_report.prod_report.tutorial.text2") as string}
												<br />
												<br />
												{t("dashboard.company_report.prod_report.tutorial.text3") as string}
												<br />
												<br />
												{t("dashboard.company_report.prod_report.tutorial.text4") as string}{" "}
												<br />
												<br />
												{t("dashboard.company_report.prod_report.tutorial.text5") as string}{" "}
											</p>
											<br />
											<h5>{t("dashboard.company_report.prod_report.cost") as string}</h5>
											<p>
												{t("dashboard.company_report.prod_report.tutorial.text6") as string}{" "}
											</p>
											<br />
											<h5>{t("dashboard.company_report.prod_report.total_cost") as string}</h5>
											<p>
												= {t("dashboard.company_report.prod_report.cost") as string}
												<br />
												+ {t("dashboard.company_report.profit_loss.deductions") as string}
												<br />
												+ {t("dashboard.company_report.profit_loss.cost_marketing") as string}
												<br />
												+ {t("dashboard.company_report.prod_report.tutorial.interest_loan") as string}
												<br />
												+ {t("dashboard.company_report.profit_loss.cost_upgrade") as string}
												<br />
												+ {t("dashboard.company_report.prod_report.tutorial.text7") as string}
												<br />+ {t("dashboard.company_report.profit_loss.cost_rnd") as string}
											</p>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.prod_report.quantity") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production?.production)} {t("misc.pieces") as string}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.prod_report.max_capacity") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.capacity)} {t("misc.pieces") as string}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.prod_report.coef_utilisation") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.utilization)} %
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.prod_report.cost") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.man_cost)} €/{t("misc.pieces") as string}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.prod_report.stocks") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.new_inventory)} {t("misc.pieces") as string}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.prod_report.total_cost") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.man_cost_all)} €/{t("misc.pieces") as string}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.company_report.sales_report.title") as string}</h2>
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
									textTitle={`${t("dashboard.company_report.sales_report.title")} 💡`}
									textContent={
										<div>
											{t("dashboard.company_report.sales_report.tip.text1") as string}
											<br />
											<br />
											{t("dashboard.company_report.sales_report.tip.text2") as string}
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.sales_report.orders_recieved") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_received)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.sales_report.orders_fulfilled") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_fulfilled)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.sales_report.orders_unfulfilled") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_unfulfilled)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.sales_report.selling_price") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.selling_price)} €/{t("misc.pieces") as string}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.sales_report.ros") as string}</td>
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
									<td className="px-4 py-2">{t("dashboard.company_report.sales_report.roa") as string}</td>
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
							<h2>{t("dashboard.company_report.balance_sheet.title") as string}</h2>
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
										textTitle={`${t("dashboard.company_report.balance_sheet.title")}`}
										textContent={
											<div>
												<h5>{t("dashboard.company_report.balance_sheet.funds") as string}</h5>
												= {t("dashboard.company_report.balance_sheet.tutorial.text1") as string} <br />
												<i>
													{t("dashboard.company_report.balance_sheet.tutorial.text2") as string}
												</i>
												<br />
												<br />
												<h5>{t("dashboard.company_report.balance_sheet.long_assets") as string}</h5>
												= {t("dashboard.company_report.balance_sheet.tutorial.text3") as string}
												<br />
												<i>{t("dashboard.company_report.balance_sheet.tutorial.text4") as string}</i>
												<br />
												<br />
												<h5>{t("dashboard.company_report.balance_sheet.stocks") as string}</h5>{t("dashboard.company_report.balance_sheet.tutorial.text5") as string} <br />
												<br />
												<h5>{t("dashboard.company_report.balance_sheet.previous") as string}</h5>
												{t("dashboard.company_report.balance_sheet.tutorial.text6") as string}
												<br />
												<br />
												<h5>{t("dashboard.company_report.balance_sheet.capital") as string}</h5>
												{t("dashboard.company_report.balance_sheet.tutorial.text7") as string}
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
										textTitle={`${t("dashboard.company_report.balance_sheet.title")} 💡`}
										textContent={
											<div>
												{t("dashboard.company_report.balance_sheet.tip.text1") as string}
											</div>
										}
									/>
								)}
							</div>
						</div>
						<table className="table-auto table-white">
							<thead>
								<tr>
									<th className="px-4 py-2 bg-white">{t("dashboard.company_report.balance_sheet.assets") as string}</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.balance_sheet.funds") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.cash)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.balance_sheet.stocks") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.inventory_money)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.balance_sheet.long_assets") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.capital_investments)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.company_report.balance_sheet.sum_assets") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap font-bold">
										{numberWithSpaces(data?.balance.assets_summary)} €
									</td>
								</tr>
							</tbody>
							<thead>
								<tr>
									<th className="px-4 py-2 bg-white">{t("dashboard.company_report.balance_sheet.liabilities") as string}</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.balance_sheet.loans") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.loans)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.balance_sheet.previous") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.ret_earnings)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.balance_sheet.capital") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.base_capital)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.company_report.balance_sheet.sum_liab") as string}</b>
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
											<h5>{t("dashboard.company_report.cashflow.expen_stock") as string}</h5>
											= {t("dashboard.company_report.cashflow.tutorial.text1") as string} <br />
											<br />
											<h5>{t("dashboard.company_report.cashflow.expen_decision") as string}</h5>
											= {t("dashboard.company_report.cashflow.tutorial.text2") as string} <br />
											<br />
											<h5>{t("dashboard.company_report.cashflow.expen_interest") as string}</h5>
											= {t("dashboard.company_report.cashflow.tutorial.text3") as string} <br />
											<br />
											<h5>{t("dashboard.company_report.cashflow.initial") as string}</h5>
											= {t("dashboard.company_report.cashflow.tutorial.text4") as string} <br />
											<br />
											<h5>{t("dashboard.company_report.cashflow.final") as string}</h5>
											= {t("dashboard.company_report.cashflow.tutorial.text5") as string}
											<br />
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.cashflow.initial") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.beginning_cash)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.cashflow.revenue") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.sales)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.cashflow.expen_products") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.manufactured_man_cost)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.cashflow.expen_stock") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.inventory_charge)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.cashflow.expen_decision") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.expenses)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.cashflow.expen_interest") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.interest)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.cashflow.tax") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.tax)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.company_report.cashflow.result_flow") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.cash_flow.cash_flow_result)} €</b>
									</td>
								</tr>
								{data?.cash_flow.new_loans > 0 ? (
									<tr>
										<td className="px-4 py-2">{t("dashboard.company_report.cashflow.new_loans") as string}</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{numberWithSpaces(data?.cash_flow.new_loans)} €
										</td>
									</tr>
								) : (
									<tr>
										<td className="px-4 py-2">{t("dashboard.company_report.cashflow.loan_repay") as string}</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{numberWithSpaces(data?.cash_flow.loan_repayment)} €
										</td>
									</tr>
								)}
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.company_report.cashflow.final") as string}</b>
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
							<h2>{t("dashboard.company_report.profit_loss.title") as string}</h2>
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
									textTitle={`${t("dashboard.company_report.profit_loss.title")}`}
									textContent={
										<div>
											<h5>{t("dashboard.company_report.profit_loss.cost_sold") as string}</h5>
											= {t("dashboard.company_report.profit_loss.tutorial.text1") as string} <br />
											{t("dashboard.company_report.profit_loss.tutorial.text2") as string} <br />
											<br />
											<h5>{t("dashboard.company_report.profit_loss.deductions") as string}</h5>
											= {t("dashboard.company_report.balance_sheet.long_assets") as string} * 0,0125
											<br />
											<i>{t("dashboard.company_report.profit_loss.tutorial.text3") as string}</i>
											<br />
											<br />
											<h5>{t("dashboard.company_report.profit_loss.cost_management") as string}</h5>
											= {t("dashboard.company_report.profit_loss.tutorial.text4") as string}
											<br />
											<br />
											<h5>{t("dashboard.company_report.profit_loss.cost_upgrade") as string}</h5>
											<i>
												{t("dashboard.company_report.profit_loss.tutorial.text5") as string}{" "}
											</i>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.sales") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.sales)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.cost_sold") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.manufactured_man_cost)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.cost_marketing") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.marketing)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.cost_rnd") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.r_d)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.deductions") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.depreciation)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.cost_management") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.inventory_charge)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.cost_upgrade") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.inventory_upgrade)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.interest") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.interest)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.company_report.profit_loss.before_tax") as string}</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.income_statement.profit_before_tax)} €</b>
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">{t("dashboard.company_report.profit_loss.tax") as string}</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.tax)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>{t("dashboard.company_report.profit_loss.after_tax") as string}</b>
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
