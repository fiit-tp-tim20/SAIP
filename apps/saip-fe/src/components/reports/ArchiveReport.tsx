import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import Tutorial from "../modal/Tutorial";
import getArchiveReport from "../../api/GetArchiveReport";
import numberWithSpaces from "../../utils/numberWithSpaces";
// @ts-ignore
import { MyContext } from "../../api/MyContext.js";
import getCompanyReport from "../../api/GetCompanyReport";

function ArchiveReport() {
	const dataWs = useContext(MyContext);
	// @ts-ignore
	const TURN = dataWs.num;
	// @ts-ignore
	const [turn, setTurn] = useState<number>(dataWs.num - 1);
	const { isLoading, data } = useQuery(["archiveReport", turn], () => getArchiveReport(turn));

	// State for managing tutorial visibility
	const [isTutorialOpen, setTutorialOpen] = useState<boolean>(true);

	// State for managing tutorial visibility
	const [tutorialStates, setTutorialStates] = useState({
		archive_report_tip: false,
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

	// poradie
	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<div className="flex flex-row justify-between">
				<div className="flex items-center">
					<h1 className="my-4 mr-4">Archív rozhodnutí</h1>
					<button
						onClick={() => openTutorial("archive_report_tip")}
						className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
					>
						💡
					</button>
					{tutorialStates.archive_report_tip && (
						<Tutorial
							isOpen={tutorialStates.archive_report_tip}
							closeModal={() => closeTutorial("archive_report_tip")}
							textTitle="Archív rozhodnutí 💡"
							textContent={
								<div>
									<p>Investície do vylepšení sú vyjadrené ako súčet investícií do vylepšení.</p>
									<br />
									<br />
									<p>
										Nie je možné určiť, ktoré vylepšenie podnik v ktorom kole vyvíjal. Je potrebné
										si viesť o tom evidenciu zvlášť.
									</p>
								</div>
							}
						/>
					)}
				</div>
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
				<div>
					<div className="grid gap-4 xl:grid-cols-2">
						<div className="background-container my-2 flex flex-col rounded-2xl p-6">
							<div className="flex flex-row items-center justify-between py-2">
								<h2>Archív marketingu</h2>
							</div>
							<table className="table-auto table-white">
								<tbody>
									<tr>
										<th className="px-4 py-2">Kolo</th>
										<th className="px-4 py-2">Virálny marketing</th>
										<th className="px-4 py-2">OOH</th>
										<th className="px-4 py-2">Billboardy</th>
										<th className="px-4 py-2">Televízia</th>
										<th className="px-4 py-2">Podcasty</th>
									</tr>
									{[...Array(turn).keys()].map((turn) => (
										<tr key={turn}>
											<td className="px-4 py-2">{turn + 1}</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.marketing.viral[turn])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.marketing.ooh[turn])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.marketing.billboard[turn])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.marketing.tv[turn])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.marketing.podcast[turn])} €
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="background-container my-2 flex flex-col rounded-2xl p-6">
							<div className="flex flex-row items-center justify-between py-2">
								<h2>Archív produkcie</h2>
							</div>
							<table className="table-auto table-white">
								<tbody>
									<tr>
										<th className="px-4 py-2">Kolo</th>
										<th className="px-4 py-2">Vyrobené množstvo</th>
										<th className="px-4 py-2">Predajná cena</th>
										<th className="px-4 py-2">Investície do kapitálu</th>
										<th className="px-4 py-2">Investície do vylepšení</th>
									</tr>
									{[...Array(turn).keys()].map((turn) => (
										<tr key={turn}>
											<td className="px-4 py-2">{turn + 1}</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.production.volume[turn])} ks
											</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.production.sell_price[turn])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.factory.capital[turn])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap">
												{numberWithSpaces(data.factory.upgrades[turn])} €
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ArchiveReport;
