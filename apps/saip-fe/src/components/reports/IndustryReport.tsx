import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import Tutorial from "../modal/Tutorial";
import getIndustryReport, { IndustryReport as IndustryReportType } from "../../api/GetIndustryReport";
import { getIndustryGraphData } from "../../api/GetIndustryGraphData";
import IndustryGraph from "../statisticsGraph/IndustryGraph";
import numberWithSpaces from "../../utils/numberWithSpaces";
// @ts-ignore
import { MyContext } from "../../api/MyContext.js";

const sortByStockPrice = (a: IndustryReportType, b: IndustryReportType) => {
	if (!a.stock_price) return 1;
	if (!b.stock_price) return -1;

	if (a.stock_price > b.stock_price) return -1;
	if (a.stock_price < b.stock_price) return 1;
	return 0;
};

function IndustryReport() {
	const dataWs = useContext(MyContext);
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
	const _turn = dataWs.num;

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
				<h1 className="my-4">Industry Report</h1>
				<div>
					<label htmlFor="turn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Pre kolo
					</label>
					<select
						id="turn"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Rebríček všetkých firiem (podľa akcií)</h2>
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
										textTitle="Rebríček všetkých firiem (podľa akcií)"
										textContent={
											<div>
												<p>
													<h6>Hodnota akcie</h6>= (hodnota DHM + finančné prostriedky * 0,2 +
													výsledky hospodárenia min. období *0,3 + suma výnosov do marketingu
													- Pôžičky ) / 1 000
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
										textTitle="Rebríček všetkých firiem 💡"
										textContent={
											<div>
												<p>
													V simulácií môže existovať aj spoločnosť riadená počítačom - bot.
													Existujú tri typy botov s rôznymi stratégiami: bot s nízkou cenou,
													bot s vysokou cenou, bot so strednou cenou.
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
									<th className="px-4 py-2 text-left table-header"> </th>
									<th className="px-4 py-2 text-left table-header text-white">Spoločnosť</th>
									<th className="px-4 py-2 text-left table-header text-white">
										Hodnota jednej akcie
									</th>
									<th className="px-4 py-2 text-left table-header text-white">
										Výsledok hospodárenia po zdanení
									</th>
									<th className="px-4 py-2 text-left table-header text-white">Predajná cena</th>
									<th className="px-4 py-2 text-left table-header text-white">Podiel na trhu</th>
								</tr>
							</thead>
							<tbody>
								{data &&
									Object.entries(data?.industry)
										.sort((a, b) => sortByStockPrice(a[1], b[1]))
										.map((industry, index) => (
											<tr key={industry[0]}>
												<td className="px-4 py-2">{index + 1}</td>
												<td className="px-4 py-2">{industry[0]}</td>
												<td className="px-4 py-2">
													{numberWithSpaces(industry[1].stock_price)} €
												</td>
												<td className="px-4 py-2">
													{numberWithSpaces(industry[1].net_profit)} €
												</td>
												<td className="px-4 py-2">
													{numberWithSpaces(industry[1].sell_price)} €/ks
												</td>
												<td className="px-4 py-2">
													{numberWithSpaces(industry[1].market_share)} %
												</td>
											</tr>
										))}
							</tbody>
						</table>
					</div>

					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Správa o odvetví</h2>
						</div>
						<table className="table-auto table-white">
							<thead>
								<tr>
									<th className="px-4 py-2 text-left table-header text-white">Kategória</th>
									<th className="px-4 py-2 text-left table-header text-white">Hodnota</th>
									<th className="px-4 py-2 text-left table-header text-white">Nárast / pokles</th>
								</tr>
							</thead>
							<tbody>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Celkové objednávky</td>
									<td className="px-4 py-2">{numberWithSpaces(data?.market.demand)}</td>
									<td className="px-4 py-2">{numberWithSpaces(data?.market.demand_difference)} %</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Celkový predaj</td>
									<td className="px-4 py-2">{numberWithSpaces(data?.market.sold_products)}</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.market.sold_products_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Celková výroba</td>
									<td className="px-4 py-2">{numberWithSpaces(data?.market.manufactured)}</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.market.manufactured_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Celková kapacita</td>
									<td className="px-4 py-2">{numberWithSpaces(data?.market.capacity)}</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.market.capacity_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Celkové zásoby v odvetví</td>
									<td className="px-4 py-2">{numberWithSpaces(data?.market.inventory)}</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.market.inventory_difference)} %
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Ekonomické parametre trhu</h2>
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
									textTitle="Ekonomické parametre trhu 💡"
									textContent={
										<div>
											<p>
												Ekonomické parametre môžu byť počas simulácie menené administrátorom.
												Dôležitým parametrom, ktorý môže ovplyvniť výšku nákladov je inflácia.
											</p>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<thead>
								<th className="px-4 py-2 text-left table-header text-white">Parameter</th>
								<th className="px-4 py-2 text-left table-header text-white">Hodnota</th>
								<th className="px-4 py-2 text-left table-header text-white">Nárast / pokles</th>
							</thead>
							<tbody>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Úroková sadzba</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.interest_rate)} %
									</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.interest_rate_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Úverový limit</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.loan_limit)} €
									</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.loan_limit_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Sadzba dane z prijmu</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.tax_rate)} %
									</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.tax_rate_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="px-4 py-2">Inflácia</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.inflation)} %
									</td>
									<td className="px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.inflation_difference)} %
									</td>
								</tr>
							</tbody>
						</table>
					</div>
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
				</>
			)}
		</div>
	);
}

export default IndustryReport;
