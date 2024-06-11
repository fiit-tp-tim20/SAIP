import React, { useState, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import Slider from "../components/slider/Slider";
import Tutorial from "../components/modal/Tutorial";
import useCompanyStore from "../store/Company";
import { getCompanyStats } from "../api/GetCompanyStats";
import CompanyGraph from "../components/statisticsGraph/CompanyGraph";
import getCompanyReport from "../api/GetCompanyReport";

// @ts-ignore
import { MyContext } from "../api/MyContext";
import getGeneralInfo from "../api/CompanyInfo";

function Company() {
	const { t } = useTranslation();
	const data = useContext(MyContext);
	// @ts-ignore
	const turn = data.turnNum;
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
			<h1 className="my-4">{t("misc.statistics") as string}</h1>
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
				<h1 className="my-4">{t("production_sales.finances_distribution") as string}</h1>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>{t("production_sales.pieces_produced.title") as string}</h2>
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
								textTitle={`${t("production_sales.pieces_produced.title")} 💡`}
								textContent={
									<div>
										<p>
											{t("production_sales.pieces_produced.tip.text1") as string}
										</p>
										<br />
										= {t("production_sales.pieces_produced.tip.text2") as string}
										<br />
										<p>
											{t("production_sales.pieces_produced.tip.text3") as string}
										</p>{" "}
										<br />
										<p style={{ fontSize: "14px" }}>
											{t("production_sales.pieces_produced.tip.text4") as string} -{">"}{" "}
											{t("dashboard.company_report.title") as string} -{">"} {t("dashboard.company_report.prod_report.title") as string}
										</p>
										<br />
										<p>
											{" "}
											{t("production_sales.pieces_produced.tip.text5") as string}
										</p>
										<br />
										<b>
											{t("production_sales.pieces_produced.tip.text6") as string}
										</b>
										<ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
											<li>
												{t("production_sales.pieces_produced.tip.text7") as string}
											</li>
											<li>{t("production_sales.pieces_produced.tip.text8") as string}</li>
											<li>{t("production_sales.pieces_produced.tip.text9") as string}</li>
											<li>{t("production_sales.pieces_produced.tip.text10") as string}</li>
											<li>{t("production_sales.pieces_produced.tip.text11") as string}</li>
										</ul>
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">{t("production_sales.pieces_produced.text") as string}</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("production_sales.pieces_produced.misc") as string}</h3>
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
						<h2>{t("production_sales.selling_price.title") as string}</h2>
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
								textTitle={`${t("production_sales.selling_price.title")} 💡`}
								textContent={
									<div>
										<p>{t("production_sales.selling_price.tip.text1") as string}</p>
										<br />
										<p>
											{t("production_sales.selling_price.tip.text2") as string}
										</p>
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">{t("production_sales.selling_price.text") as string}</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("production_sales.selling_price.misc") as string}</h3>
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
						<h2>{t("production_sales.capital_investment.title") as string}</h2>
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
								textTitle={`${t("production_sales.capital_investment.title")} 💡`}
								textContent={
									<div>
										<p>
											{t("production_sales.capital_investment.tip.text1") as string}
										</p>
										<p>
											{t("production_sales.capital_investment.tip.text2") as string}
										</p>
										<br />
										<p>
											{t("production_sales.capital_investment.tip.text3") as string} <br />
											{t("production_sales.capital_investment.tip.text4") as string}
										</p>
										<br />
										<p>
											{t("production_sales.capital_investment.tip.text5") as string}
										</p>
									</div>
								}
							/>
						)}
					</div>
					<p className="pt-1">{t("production_sales.capital_investment.text") as string}</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>{t("production_sales.capital_investment.misc") as string}</h3>
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
