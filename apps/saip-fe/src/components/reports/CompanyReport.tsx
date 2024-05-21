import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Tutorial from "../modal/Tutorial";
import getCompanyReport from "../../api/GetCompanyReport";
import numberWithSpaces from "../../utils/numberWithSpaces";
// @ts-ignore
import { MyContext } from "../../api/MyContext";

function CompanyReport() {
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
	const downloadCsv = (csvString: BlobPart) => {
		const blob = new Blob([csvString], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'data.csv');
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
		const headers = Object.keys(jsonArray[0]).map((key) => {
			if (typeof jsonArray[0][key] === 'object') {
				return Object.keys(jsonArray[0][key]).map((subKey) => `${key}.${subKey}`).join(',');
			}
			return key;
		}).flat().join(',');

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
			for (let i = 0; i <= turn; i++) {
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
				<h1 className="my-4">Správa o spoločnosti</h1>
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
							<h2>Správa o výrobe</h2>
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
									textTitle="Správa o výrobe"
									textContent={
										<div>
											<h5>Koeficient využitia výrobnej kapacity</h5>
											<p>= objem produkcie / maximálna výrobná kapacita * 100</p>
											<br />
											<b>Príklad</b> <br />
											<p style={{ fontSize: "14px" }}>
												Výrobné náklady sú členené na fixné a variabilné.
												<br />
												<br />
												Počiatočná výška fixných nákladov je 48 500 €. Fixné náklady sa menia
												skokovo vždy po prekročení 100 ks výrobnej kapacity. K prvému nárastu
												dochádza pri prekročení výrobnej kapacity 200 ks o 48 500 €. Následne po
												ďalších 100 ks rastú o 48 500 €.
												<br />
												<br />
												Variabilné náklady sú na začiatku simulácie 250 €/ks. Po dokončení
												vylepšenia ich hodnota stúpne v závislosti od dokončeného výskumu.{" "}
												<br />
												<br />
												Na variabilné a fixné náklady vplýva inflácia.{" "}
											</p>
											<br />
											<h5>Výrobné náklady</h5>
											<p>
												= (počet kusov * cena materiálu za kus * suma modifikátorov vylepšení *
												inflácia + fixné náklady) * koeficient nadmerného zaťaženia výroby{" "}
											</p>
											<br />
											<h5>Celkové náklady</h5>
											<p>
												= Výrobné náklady
												<br />
												+ odpisy
												<br />
												+ náklady na marketing
												<br />
												+ úroky z pôžičky
												<br />
												+ náklady za vylepšenie uskladneného produktu
												<br />
												+ poplatok za skladovanie: počet uskladnených kusov * 100
												<br />+ náklady na výskum a vývoj
											</p>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">Vyrobené množstvo</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production?.production)} ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Výrobná kapacita (max)</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.capacity)} ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Koeficient využitia výrobnej kapacity (minulé kolo)</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.utilization)} %
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Výrobné náklady</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.man_cost)} €/ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Zásoby</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.new_inventory)} ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Celkové náklady</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.production.man_cost_all)} €/ks
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Správa o predaji</h2>
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
									textTitle="Správa o predaji 💡"
									textContent={
										<div>
											Ak máš málo objednávok, analyzuj svoju predajnú cenu a investície do
											marketingu. Koľko je zákazníkov na trhu? Aká je štruktúra a cenové stratégie
											konkurencie? Mysli na to, že na trhu existujú rôzne skupiny zákazníkov,
											ktoré majú rôzne cenové, marketingové a inovačné preferencie.
											<br />
											<br />
											Ak máš veľa nesplnených objednávok, tak máš veľký dopyt po produkte a
											vyrábaš málo kusov.
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">Prijaté objednávky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_received)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Splnené objednávky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_fulfilled)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Nesplnené objednávky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.orders_unfulfilled)}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Predajná cena</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.sales.selling_price)} €/ks
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Rentabilita tržieb (ROS)</td>
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
									<td className="px-4 py-2">Rentabilitu majetku (ROA)</td>
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
							<h2>Súvaha</h2>
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
										textTitle="Súvaha"
										textContent={
											<div>
												<h5>Finančné prostriedky</h5>
												= finančné prostriedky v hotovosti a na bankovom účte <br />
												<i>
													jeho hodnota klesá každé obdobie o výšku odpisov a stúpa o
													investíciu do kapitálu
												</i>
												<br />
												<br />
												<h5>Dlhodobý majetok</h5>
												= hodnota továrne
												<br />
												<i>od týchto investicií závisi výrobná kapacita</i>
												<br />
												<br />
												<h5>Zásoby</h5>hodnota zásob ocenená metódou FIFO <br />
												<br />
												<h5>Výsledok hospodárenia z predchádzajúcich období</h5>
												suma všetkých výsledkov hospodárení za celú dobu trvania simulácie
												<br />
												<br />
												<h5>Základné imanie</h5>
												počiatočný vklad vlastníkov spoločnosti, nemenný počas celej doby
												simulácie
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
										textTitle="Súvaha 💡"
										textContent={
											<div>
												Mysli na to, že ak máš na sklade zásoby, musíš sa o ne starať, s čím sú
												spojené zvýšené náklady.
											</div>
										}
									/>
								)}
							</div>
						</div>
						<table className="table-auto table-white">
							<thead>
								<tr>
									<th className="px-4 py-2 bg-white">Aktíva</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="px-4 py-2">Finančné prostriedky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.cash)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Zásoby</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.inventory_money)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Dlhodobý majetok</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.capital_investments)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>Súčet aktív</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap font-bold">
										{numberWithSpaces(data?.balance.assets_summary)} €
									</td>
								</tr>
							</tbody>
							<thead>
								<tr>
									<th className="px-4 py-2 bg-white">Pasíva</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="px-4 py-2">Pôžičky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.loans)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Výsledok hospodárenia z predchádzajúcich období</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.ret_earnings)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Základné imanie</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.balance.base_capital)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>Súčet pasív</b>
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
											<h5>Výdavky na zásoby</h5>
											= výdavky na skladovanie zásob + výdavky na upgrade zásob <br />
											<br />
											<h5>Výdavky na rozhodnutia</h5>
											= investície do marketingu + R&D + kapitálu <br />
											<br />
											<h5>Výdavky na úroky</h5>
											= úrok z pôžičky <br />
											<br />
											<h5>Začiatočný stav</h5>
											= finančné prostriedky na začiatku obdobia (sú rovnaké ako konečný stav
											minulého obdobia) <br />
											<br />
											<h5>Konečný stav</h5>
											= finančné prostriedky na konci obdobia
											<br />
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">Počiatočný stav</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.beginning_cash)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Príjmy z predaja výrobkov</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.sales)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Výdavky na vyrobené výrobky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.manufactured_man_cost)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Výdavky na zásoby</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.inventory_charge)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Výdavky na rozhodnutia</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.expenses)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2"> Výdavky na úroky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.interest)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Zaplatená daň</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.cash_flow.tax)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>Výsledok finančného toku</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.cash_flow.cash_flow_result)} €</b>
									</td>
								</tr>
								{data?.cash_flow.new_loans > 0 ? (
									<tr>
										<td className="px-4 py-2">Nové úvery</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{numberWithSpaces(data?.cash_flow.new_loans)} €
										</td>
									</tr>
								) : (
									<tr>
										<td className="px-4 py-2">Splátka úveru</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{numberWithSpaces(data?.cash_flow.loan_repayment)} €
										</td>
									</tr>
								)}
								<tr>
									<td className="px-4 py-2">
										<b>Konečný stav</b>
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
							<h2>Výkaz ziskov a strát</h2>
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
									textTitle="Výkaz ziskov a strát"
									textContent={
										<div>
											<h5>Náklady na predaný tovar</h5>
											= hodnota predaného tovaru. <br />
											Ak spoločnosť mala v predchádzajúcom období zásoby, najskôr sa predajú
											zásoby a až potom dochádza k predaju nových výrobkov. Hodnota vyskladnených
											zásob je ocenená metódou FIFO. <br />
											<br />
											<h5>Odpisy</h5>
											= DHM * 0,0125
											<br />
											<i>odpis z kapitálových investícií</i>
											<br />
											<br />
											<h5>Náklady na spravovanie</h5>
											= cena za uskladnenie jednotky * počet kusov na sklade
											<br />
											<br />
											<h5>Náklady na upgrade zásob</h5>
											<i>
												ak je dokončené vylepšenie a podnik má na sklade zásoby, tieto zásoby sa
												upgradnú o dokončené vylepšenie, s čím sú spojené aj náklady{" "}
											</i>
										</div>
									}
								/>
							)}
						</div>
						<table className="table-auto table-white">
							<tbody>
								<tr>
									<td className="px-4 py-2">Tržby z predaja výrobkov</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.sales)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Náklady na predaný tovar</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.manufactured_man_cost)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Náklady na marketing</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.marketing)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Náklady na výskum a vývoj</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.r_d)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Odpisy</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.depreciation)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Náklady na spravovanie</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.inventory_charge)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Náklady na upgrade zásob</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.inventory_upgrade)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Nákladové úroky</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.interest)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>Výsledok hospodárenia pred zdanením</b>
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										<b>{numberWithSpaces(data?.income_statement.profit_before_tax)} €</b>
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">Daň</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{numberWithSpaces(data?.income_statement.tax)} €
									</td>
								</tr>
								<tr>
									<td className="px-4 py-2">
										<b>Výsledok hospodárenia po zdanení</b>
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
