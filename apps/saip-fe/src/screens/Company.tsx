import React, { useState } from "react";
import { useQuery } from "react-query";
import Slider from "../components/slider/Slider";
import Tutorial from "../components/modal/Tutorial";
import useCompanyStore from "../store/Company";
import { getCompanyStats } from "../api/GetCompanyStats";
import CompanyGraph from "../components/statisticsGraph/CompanyGraph";
import { getTurn } from "../api/GetTurn";
import getCompanyReport from "../api/GetCompanyReport";

function Company() {
	const token = localStorage.getItem("token");

	const { data: turn } = useQuery({
		queryKey: ["currentTurn"],
		queryFn: () => token && getTurn(),
	});

	const { isLoading: statsIsLoading, data: statsData } = useQuery(["getCompanyStats"], getCompanyStats);
	const { data: reportData } = useQuery(["companyReport", turn], () => getCompanyReport(turn.Number - 1));

	const {
		productCount,
		productCountChecked,
		productPrice,
		productPriceChecked,
		capitalInvestments,
		capitalInvestmentsChecked,
		setProductCount,
		setProductCountChecked,
		setProductPrice,
		setProductPriceChecked,
		setCapitalInvestments,
		setCapitalInvestmentsChecked,
	} = useCompanyStore();

	// State for managing tutorial visibility
	const [isTutorialOpen, setTutorialOpen] = useState<boolean>(true);

	// State for managing tutorial visibility
	const [tutorialStates, setTutorialStates] = useState({
		production: false,
		price: false,
		invest: false,
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
		<div className="flex flex-col xl:w-[1280px] md:w-[900px] w-[600px]">
			<h1 className="my-4">Štatistiky</h1>
			<div className="background-container my-2 flex flex-col rounded-2xl p-6">
				{statsIsLoading ? (
					<div>Loading...</div>
				) : (
					<CompanyGraph manufactured={statsData?.manufactured} sold={statsData?.sold} />
				)}
			</div>
			<div className="flex flex-col">
				<h1 className="my-4">Rozdelenie financií</h1>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Počet produkovaných kusov</h2>
						{/* Add a button to open the tutorial */}
						<button
							onClick={() => openTutorial("production")}
							className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
						>
							💡
						</button>
						{tutorialStates.production && (
							<Tutorial
								isOpen={tutorialStates.production}
								closeModal={() => closeTutorial("production")}
								textTitle="Tip"
								textContent={
									<div>
										Optimálny počet produkovaných kusov do ďalšieho obdobia je 90% maximálnej výrobnej kapacity.
										<br/>
										<br/>
										= 0,9 * (hodnota továrne / 500)
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">
						Počet produkovaných kusov je počet kusov, ktoré sa vyrobia v určitom časovom období.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Počet kusov (ks)</h3>
						<div>
							<Slider
								min={1}
								max={reportData ? reportData.production.capacity : 1000}
								value={productCount}
								setValue={setProductCount}
								checked={productCountChecked}
								setChecked={setProductCountChecked}
								step={1}
								limitMin
								limitMax
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Predajná cena</h2>
						{/* Add a button to open the tutorial */}
						<button
							onClick={() => openTutorial("price")}
							className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
						>
							💡
						</button>
						{tutorialStates.price && (
							<Tutorial
								isOpen={tutorialStates.price}
								closeModal={() => closeTutorial("price")}
								textTitle="Tip"
								textContent={
									<div>
										Maximálna predajná cena je 15 000 €.
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">
						Predajná cena je cena, za ktorú sa predáva produkt zákazníkovi. Predajná cena je kľúčovým
						faktorom pri rozhodovaní zákazníka o nákupe produktu a je dôležitou súčasťou trhového
						rozhodovania pre predávajúceho. Môže byť ovplyvnená mnohými faktormi, ako je napríklad
						konkurencia, trhová situácia, náklady na marketing a reklamu. Predajná cena je dôležitým
						faktorom pre zákazníka aj pre predávajúceho, pretože môže mať významný vplyv na rozhodnutie o
						nákupe a na celkový úspech podnikania.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Predajná cena (€/ks)</h3>
						<div>
							<Slider
								min={0}
								max={15000}
								value={productPrice}
								setValue={setProductPrice}
								checked={productPriceChecked}
								setChecked={setProductPriceChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Investície do kapitálu</h2>
						{/* Add a button to open the tutorial */}
						<button
							onClick={() => openTutorial("invest")}
							className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
						>
							💡
						</button>
						{tutorialStates.invest && (
							<Tutorial
								isOpen={tutorialStates.invest}
								closeModal={() => closeTutorial("invest")}
								textTitle="Tip"
								textContent={
									<div>
										Aby neklesal kapitál, je potrebné minimálne investovať do kapitálu danú čiastku<br/>
										<br/>
										= 0,0125 * hodnota továrne
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">
						Investície do kapitálu sú investície do majetku, ktoré sa používajú na výrobu produktov. Je
						dôležité vykonať dôkladnú analýzu a zvážiť všetky faktory, ako je napríklad história podnikania,
						finančná situácia, a perspektíva budúceho vývoja, pred rozhodnutím investovať do kapitálu.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia (€)</h3>
						<div>
							<Slider
								min={0}
								max={10000}
								value={capitalInvestments}
								setValue={setCapitalInvestments}
								checked={capitalInvestmentsChecked}
								setChecked={setCapitalInvestmentsChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Company;
