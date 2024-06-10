import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import Tutorial from "../modal/Tutorial";
import getIndustryReport, { IndustryReport as IndustryReportType } from "../../api/GetIndustryReport";
import { getIndustryGraphData } from "../../api/GetIndustryGraphData";
import IndustryGraph from "../statisticsGraph/IndustryGraph";
import numberWithSpaces from "../../utils/numberWithSpaces";
// @ts-ignore
import { MyContext } from "../../api/MyContext";

const sortByStockPrice = (a: IndustryReportType, b: IndustryReportType) => {
	if (!a.stock_price) return 1;
	if (!b.stock_price) return -1;

	if (a.stock_price > b.stock_price) return -1;
	if (a.stock_price < b.stock_price) return 1;
	return 0;
};

function IndustryReport() {
	const { t } = useTranslation();
	const dataWs = useContext(MyContext);
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
	const _turn = dataWs.turnNum;

	// @ts-ignore
	const [turn, setTurn] = useState<number>(_turn - 1);

	const { data, isLoading } = useQuery(["getIndustryReport", turn], () => getIndustryReport(turn));
	const { data: graphData, isLoading: isLoading2 } = useQuery(["getIndustryGraphData"], getIndustryGraphData);

	// State for managing tutorial visibility
	const [isTutorialOpen, setTutorialOpen] = useState<boolean>(true);

	// State for managing tutorial visibility
	const [tutorialStates, setTutorialStates] = useState({
		companies_table: false,
		companies_table_tip: false,
		economy_params_tip: false,
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

	if (!isLoading && !data) {
		return <p>Industry report is not available yet</p>;
	}

	// poradie
	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<div className="flex flex-row justify-between">
				<h1 className="my-4">{t("dashboard.industry_report.title") as string}</h1>
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
						{[...Array(_turn).keys()].map((o) => {
							if (o === 0) return null;
							return <option value={o}>{o}</option>;
						})}
					</select>
				</div>
			</div>
			{isLoading ? (
				<p>a</p>
			) : (
				<>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						{isLoading2 ? (
							<div>Loading...</div>
						) : (
							<IndustryGraph
								rank={graphData?.rank}
								stock_price={graphData?.stock_price}
								num_players={graphData?.num_players}
							/>
						)}
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.industry_report.ranking") as string}</h2>
							<div>
								{/* Add a button to open the tutorial */}
								<button
									onClick={() => openTutorial("companies_table")}
									className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
								>
									?
								</button>
								{tutorialStates.companies_table && (
									<Tutorial
										isOpen={tutorialStates.companies_table}
										closeModal={() => closeTutorial("companies_table")}
										textTitle={`${t("dashboard.industry_report.ranking")}`}
										textContent={
											<div>
												<p>
													<h6>
														{t("dashboard.industry_report.table.tutorial.text1") as string}
													</h6>
													= {t("dashboard.industry_report.table.tutorial.text2") as string}
												</p>
											</div>
										}
									/>
								)}
								{/* Add a button to open the tutorial */}
								<button
									onClick={() => openTutorial("companies_table_tip")}
									className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
								>
									💡
								</button>
								{tutorialStates.companies_table_tip && (
									<Tutorial
										isOpen={tutorialStates.companies_table_tip}
										closeModal={() => closeTutorial("companies_table_tip")}
										textTitle={`${t("dashboard.industry_report.ranking")} 💡`}
										textContent={
											<div>
												<p>
													{t("dashboard.industry_report.table.tip.text1") as string}
												</p>
											</div>
										}
									/>
								)}
							</div>
						</div>
						<table className="table-auto table-white">
							<thead>
								<tr>
									<th className="px-4 py-2 text-left table-header" />
									<th className="px-4 py-2 text-left table-header text-white">
										{t("dashboard.industry_report.table.company") as string}
									</th>
									<th className="px-4 py-2 text-left table-header text-white">
										{t("dashboard.industry_report.table.value") as string}
									</th>
									<th className="px-4 py-2 text-left table-header text-white">
										{t("dashboard.industry_report.table.after_tax") as string}
									</th>
									<th className="px-4 py-2 text-left table-header text-white">
										{t("dashboard.industry_report.table.price") as string}
									</th>
									<th className="px-4 py-2 text-left table-header text-white">
										{t("dashboard.industry_report.table.share") as string}
									</th>
									<th className="px-4 py-2 text-left table-header text-white">
										{t("dashboard.industry_report.table.upgrades") as string}
									</th>
								</tr>
							</thead>
							<tbody>
								{data &&
									Object.entries(data?.industry)
										.sort((a, b) => sortByStockPrice(a[1], b[1]))
										.map((industry, index) => (
											<tr key={industry[0]}>
												<td className="px-4 py-2">{index + 1}</td>
												<td className="px-4 py-2 text-center">{industry[0]}</td>
												<td className="px-4 py-2 text-center">
													{industry[1]?.stock_price &&
														numberWithSpaces(industry[1]?.stock_price)}{" "}
													€
												</td>
												<td className="px-4 py-2 text-center">
													{industry[1]?.net_profit &&
														numberWithSpaces(industry[1]?.net_profit)}{" "}
													€
												</td>
												<td className="px-4 py-2 text-center">
													{industry[1]?.sell_price &&
														numberWithSpaces(industry[1]?.sell_price)}{" "}
													€/{t("misc.pieces") as string}
												</td>
												<td className="px-4 py-2 text-center">
													{industry[1]?.market_share &&
														numberWithSpaces(industry[1]?.market_share)}{" "}
													%
												</td>
												<td className="px-4 py-2 text-center">
													{industry[1]?.finished_upgrades &&
														numberWithSpaces(industry[1]?.finished_upgrades)}{" "}
												</td>
											</tr>
										))}
								{/* Add row for average stock price */}
								<tr>
									<td className="px-4 py-2" />
									<td className="px-4 py-2 text-center">
										<b>{t("misc.mean") as string}</b>
									</td>
									<td className="px-4 py-2 text-center">
										{/* Calculate and display average stock price */}
										{data && (
											<b>
												{data.industry &&
													numberWithSpaces(
														(
															Object.values(data.industry).reduce(
																(acc, curr) => acc + (curr?.stock_price || 0),
																0,
															) / Object.keys(data.industry).length
														).toFixed(2),
													)}{" "}
												€
											</b>
										)}
									</td>
									<td className="px-4 py-2 text-center">
										{/* Calculate and display average net profit */}
										{data && (
											<b>
												{data.industry &&
													numberWithSpaces(
														(
															Object.values(data.industry).reduce(
																(acc, curr) => acc + (curr?.net_profit || 0),
																0,
															) / Object.keys(data.industry).length
														).toFixed(2),
													)}{" "}
												€
											</b>
										)}
									</td>
									<td className="px-4 py-2 text-center">
										{/* Calculate and display average sell price */}
										{data && (
											<b>
												{data.industry &&
													numberWithSpaces(
														Object.values(data.industry).reduce(
															(acc, curr) => acc + (curr?.sell_price || 0),
															0,
														) / Object.keys(data.industry).length,
													)}{" "}
												€/{t("misc.pieces") as string}
											</b>
										)}
									</td>
									<td className="px-4 py-2" />
									<td className="px-4 py-2" />
								</tr>
							</tbody>
						</table>
					</div>

					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.industry_report.sector_report.title") as string}</h2>
						</div>
						<table className="table-auto table-white">
							<thead>
								<tr>
									<th className="px-4 py-2 text-center table-header text-white">
										{t("dashboard.industry_report.sector_report.category") as string}
									</th>
									<th className="px-4 py-2 text-center table-header text-white">
										{t("dashboard.industry_report.sector_report.value") as string}
									</th>
									<th className="px-4 py-2 text-center table-header text-white">
										{t("dashboard.industry_report.sector_report.in_decrese") as string}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.sector_report.total_orders") as string}
									</td>
									<td className="px-4 py-2 text-center">{numberWithSpaces(data?.market.demand)}</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.demand_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.sector_report.total_sales") as string}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.sold_products)}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.sold_products_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.sector_report.total_prod") as string}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.manufactured)}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.manufactured_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.sector_report.total_capacity") as string}
									</td>
									<td className="px-4 py-2 text-center">{numberWithSpaces(data?.market.capacity)}</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.capacity_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.sector_report.total_stocks") as string}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.inventory)}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.market.inventory_difference)} %
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>{t("dashboard.industry_report.economic_params.title") as string}</h2>
							{/* Add a button to open the tutorial */}
							<button
								onClick={() => openTutorial("economy_params_tip")}
								className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
							>
								💡
							</button>
							{tutorialStates.economy_params_tip && (
								<Tutorial
									isOpen={tutorialStates.economy_params_tip}
									closeModal={() => closeTutorial("economy_params_tip")}
									textTitle={`${t("dashboard.industry_report.economic_params.title")} 💡`}
									textContent={
										<div>
											<p>
												{t("dashboard.industry_report.economic_params.tip.text1") as string}
											</p>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<thead>
								<th className="px-4 py-2 text-center table-header text-white">Parameter</th>
								<th className="px-4 py-2 text-center table-header text-white">
									{t("dashboard.industry_report.sector_report.value") as string}
								</th>
								<th className="px-4 py-2 text-center table-header text-white">
									{t("dashboard.industry_report.sector_report.in_decrese") as string}
								</th>
							</thead>
							<tbody>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.economic_params.interest") as string}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.interest_rate)} %
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.interest_rate_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.economic_params.loan") as string}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.loan_limit)} €
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.loan_limit_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.economic_params.tax") as string}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.tax_rate)} %
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.tax_rate_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2 text-center">
										{t("dashboard.industry_report.economic_params.inflation") as string}
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.inflation)} %
									</td>
									<td className="px-4 py-2 text-center">
										{numberWithSpaces(data?.economic_parameters.inflation_difference)} %
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}

export default IndustryReport;
