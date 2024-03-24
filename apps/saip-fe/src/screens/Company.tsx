import React, { useState, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import Slider from "../components/slider/Slider";
import Tutorial from "../components/modal/Tutorial";
import useCompanyStore from "../store/Company";
import { getCompanyStats } from "../api/GetCompanyStats";
import CompanyGraph from "../components/statisticsGraph/CompanyGraph";
import getCompanyReport from "../api/GetCompanyReport";

// @ts-ignore
import { MyContext } from "../api/MyContext.js";
import getGeneralInfo from "../api/CompanyInfo";

function Company() {
	const data = useContext(MyContext);
	// @ts-ignore
	const turn = data.num;
	const { isLoading: statsIsLoading, data: statsData } = useQuery(["getCompanyStats"], getCompanyStats);
	// @ts-ignore
	const { data: reportData } = useQuery(["companyReport", turn], () => getCompanyReport(turn - 1));
	const { isLoading, data: budget_data, refetch } = useQuery("companyInfo", () => getGeneralInfo());
	const [plusCash, setPlusCash] = useState(0);

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
	useEffect(() => {
		refetch();
	}, [turn]);
	useEffect(() => {
		if (!isLoading) {
			try {
				setPlusCash(budget_data.bonus_spendable_cash);
			} catch (e) {
				console.log(e);
			}
		}
	}, [data]);

	return (
		<div className="flex flex-col xl:w-[1280px] md:w-[900px] w-[600px]">
			<h1 className="my-4">Štatistiky</h1>
			<div className="background-container my-2 flex flex-col rounded-2xl p-6">
				{statsIsLoading ? (
					<div>Loading...</div>
				) : (
					<CompanyGraph
						manufactured={statsData.manufactured}
						price={statsData.sell_price}
						stored={statsData.inventory}
						capacity={statsData.capacity}
					/>
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
								textTitle="Počet produkovaných kusov Tip 💡"
								textContent={
									<div>
										<p>
											Optimálny počet produkovaných kusov do ďalšieho obdobia je 90% maximálnej
											výrobnej kapacity.
										</p>
										<br />
										= 0,9 * (hodnota továrne / 500)
										<br />
										<p>
											Každých 500€ z celkovej hodnoty továrne predstavuje jeden kus ktorý môžeme
											vyrobiť.
										</p>{" "}
										<br />
										<p style={{ fontSize: "14px" }}>
											Informácie o minimálnej výrobnej kapacite môže nájsť v: Dashboard -{">"}{" "}
											Správa o spoločnosti -{">"} Správa o výrobe
										</p>
										<br />
										<p>
											{" "}
											Mysli na to, že ak vyrobíš príliš málo produktov, budú tvoje jednotkové
											výrobné náklady vysoké (veľký príspevok fixných nákladov) a naopak, ak
											vyrobíš príliš veľa, budú tvoje výrobné náklady takisto vysoké (preťaženie
											výroby).
										</p>
										<br />
										<b>
											Pri rozhodovaní o počte produkovaných kusov si zodpovedaj na tieto otázky:
										</b>
										<ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
											<li>
												aká je optimálna výroba z hľadiska minimalizácie jednotkových nákladov?
											</li>
											<li>aká je moja maximálna výrobná kapacita?</li>
											<li>ako sa vyvíja predaj mojich produktov?</li>
											<li>mám na sklade zásoby už vyrobených kusov?</li>
											<li>aký je dopyt po mojich produktoch? Mám nejaké nesplnené objednávky?</li>
										</ul>
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">
						Počet produkovaných kusov predstavuje rozhodnutie užívateľa o výrobe na nasledujúce obdobie
						(nasledujúci kvartál). Užívateľ má možnosť voliť výrobu v intervale od 0 ks až po maximálnu
						výrobnú kapacitu.
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
								textTitle="Predajná cena Tip 💡"
								textContent={
									<div>
										<p>Maximálna predajná cena je 15 000 €. </p>
										<br />
										<p>
											Ak chceš dosiahnuť zisk, tvoja predajná cena musí byť väčšia ako celkové
											jednotkové náklady. Urči si stratégiu akou chceš postupovať (nízka cena,
											vysoká cena, priemerná cena). Analyzuj situáciu na trhu a snaž sa využiť
											dieru na trhu. Mysli na to, že každý zákazník sa správa inak, pričom cena je
											najväčším faktorom jeho rozhodnutia.
										</p>
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
								textTitle="Investície do kapitálu Tip 💡"
								textContent={
									<div>
										<p>
											Mysli na to, že dlhodobý majetok (továreň) sa s časom znehodnocuje. Peňažné
											znehodnotenie dlhodobého majetku nazývame odpisy. Ak nič neinvestuješ do
											kapitálu, klesne hodnota dlhodobého majetku v nasledujúcom období o výšku
											odpisov, čo znamená, že budeš schopný vyrobiť v ďalšom období menej kusov.
										</p>
										<p>
											Každých 500 € investovaných do kapitálu <b>nad rámec odpisov</b>, zvýši
											výrobnú kapacitu o 1 ks. Ak máš v podniku dostatočne veľké finančné
											prostriedky, môžeš do kapitálu investovať aj viac ako máš rozpočet. Tento
											bonus je vyjadrený v kontrolnej lište v zátvorkách.
										</p>
										<br />
										<p>
											Pri investícií do kapitálu zváž: <br />
											koeficient využitia výrobnej kapacity, dopyt po produktoch, veľkosť zásob,
											zvolenú cenovú stratégiu, správanie konkurentov na trhu, veľkosť trhu.
										</p>
										<br/>
										<p>
											Ak tvoja výrobná kapacita presiahne 200 ks, stúpnu fixné náklady o 48 500 €.
											Následne vždy po prekročení výrobnej kapacity oďalších 100 ks, stúpnu fixné
											náklady o 48 500 €.
										</p>
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">
						Investície do kapitálu sú investíciou do dlhodobého majetku. V našej simulácií predstavujú
						náklady na udržiavanie, modernizáciu a zväčšovanie továrne. Pomocou investícií do kapitálu
						dokáže podnik zvýšiť svoju maximálnu výrobnú kapacitu.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia (€)</h3>
						<div>
							<Slider
								min={0}
								max={10000 + plusCash}
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
