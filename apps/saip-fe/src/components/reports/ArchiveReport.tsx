import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import Tutorial from "../modal/Tutorial";
import getArchiveReport from "../../api/GetArchiveReport";
import numberWithSpaces from "../../utils/numberWithSpaces";
// @ts-ignore
import { MyContext } from "../../api/MyContext";
import getCompanyReport from "../../api/GetCompanyReport";

function ArchiveReport() {
	const dataWs = useContext(MyContext);
	// @ts-ignore
	const TURN = dataWs.turnNum;
	const {numberShow, setNumberShow} = useContext(MyContext)
	const { isLoading, data } = useQuery(["archiveReport", numberShow], () => getArchiveReport(numberShow));

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
					<label htmlFor="turn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">
						Pre kolo
					</label>
					<select
						id="turn"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500, hover:cursor-pointer"
						value={numberShow}
						onChange={(e) => setNumberShow(parseInt(e.target.value, 10))}
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
										<th className="px-4 py-2 text-center">Kolo</th>
										<th className="px-4 py-2 text-center">Virálny marketing</th>
										<th className="px-4 py-2 text-center">OOH</th>
										<th className="px-4 py-2 text-center">Billboardy</th>
										<th className="px-4 py-2 text-center">Televízia</th>
										<th className="px-4 py-2 text-center">Podcasty</th>
									</tr>
									{[...Array(numberShow).keys()].map((numberShow) => (
										<tr key={numberShow}>
											<td className="px-4 py-2 text-center">{numberShow + 1}</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.marketing.viral[numberShow])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.marketing.ooh[numberShow])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.marketing.billboard[numberShow])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.marketing.tv[numberShow])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap  text-center">
												{numberWithSpaces(data.marketing.podcast[numberShow])} €
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
										<th className="px-4 py-2 text-center">Kolo</th>
										<th className="px-4 py-2 text-center">Vyrobené množstvo</th>
										<th className="px-4 py-2 text-center">Predajná cena</th>
										<th className="px-4 py-2 text-center">Investície do kapitálu</th>
										<th className="px-4 py-2 text-center">Investície do vylepšení</th>
										<th className="px-4 py-2 text-center">Dokončené vylepšenia</th>
									</tr>
									{[...Array(numberShow).keys()].map((numberShow) => (
										<tr key={numberShow}>
											<td className="px-4 py-2 text-center">{numberShow + 1}</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.production.volume[numberShow])} ks
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.production.sell_price[numberShow])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.factory.capital[numberShow])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.factory.upgrades[numberShow])} €
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-center">
												{numberWithSpaces(data.factory.upgrade_turn[numberShow])}
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
