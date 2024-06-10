import React, { useState } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import Slider from "../components/slider/Slider";
import useMarketingStore from "../store/Marketing";
import { getMarketingStats } from "../api/GetMarketingStats";
import MarketingGraph from "../components/statisticsGraph/MarketingGraph";
import Tutorial from "../components/modal/Tutorial";

function Marketing() {
	const { t } = useTranslation();
	const { isLoading, data } = useQuery(["getMarketingStats"], getMarketingStats);

	// State for managing tutorial visibility
	const [isTutorialOpen, setTutorialOpen] = useState<boolean>(true);

	// State for managing tutorial visibility
	const [tutorialStates, setTutorialStates] = useState({
		marketing_tip: false,
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

	const {
		viral,
		viralChecked,
		ooh,
		oohChecked,
		billboard,
		billboardChecked,
		tv,
		tvChecked,
		podcast,
		podcastChecked,
		setViral,
		setViralChecked,
		setOoh,
		setOohChecked,
		setBillboard,
		setBillboardChecked,
		setTv,
		setTvChecked,
		setPodcast,
		setPodcastChecked,
	} = useMarketingStore();

	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<h1 className="my-4">{t("misc.statistics") as string}</h1>
			<div className="background-container my-2 flex flex-col rounded-2xl p-6">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<MarketingGraph
						demand={data.stats.demand}
						volume={data.stats.volume}
						orders_fulfilled={data.stats.orders_fulfilled}
					/>
				)}
			</div>

			<div className="flex flex-col">
				<div className="flex items-center">
					<h1 className="my-4 mr-4">{t("marketing.types.title") as string}</h1>
					<button
						onClick={() => openTutorial("marketing_tip")}
						className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
					>
						💡
					</button>
					{tutorialStates.marketing_tip && (
						<Tutorial
							isOpen={tutorialStates.marketing_tip}
							closeModal={() => closeTutorial("marketing_tip")}
							textTitle="Marketing 💡"
							textContent={
								<div>
									<p>
										Marketing je dôležitou súčasťou simulácie. Od marketingu závisí veľkosť trhu a
										záujem zákazníkov o produkt spoločnosti. Čím viac investuješ do marketingu, tým
										budeš zaujímavejší pre tie kategórie zákazníkov, ktorých marketing zaujíma. Čím
										viac investuješ do marketingu, tým rýchlejšie rastie veľkosť trhu.
									</p>
									<br />
									<br />
									<p>
										Každý z týchto nástrojov má iný vplyv na trh a vnímanie zákazníka. Do každého
										nástroja je možné investovať celý rozpočet, teda 10 000 €. Do výpočtu výnosu z
										marketingu (vplyvu investície marketingu na zákazníka) vstupuje marketingový
										modifikátor (odlišný pre každý marketingový nástroj).
									</p>
									<br />
									<br />
									<p>
										S rastúcou výškou investície do konkrétneho marketingového nástroja rastie aj
										jeho efektivita (od 0,7 pri minimálnej výške investície až pod 1 pri výške
										investície 10 000 €). Na začiatku simulácie existuje na trhu 100 zákazníkov na
										každú spoločnosť.
									</p>
									<br />
									<br />
									Zloženie zákazníkov na trhu je počas simulácie konštantné:
									<ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
										<li>zákazníci preferujúci nízku cenu (40%)</li>
										<li>zákazníci preferujúci priemernú cenu na trhu (25%)</li>
										<li> zákazníci preferujúci vysokú cenu (20%)</li>
										<li>zákazníci zameraní na inovácie (15%)</li>
									</ul>
								</div>
							}
						/>
					)}
					<button
						onClick={() => {
							setBillboardChecked(true);
							setOohChecked(true);
							setTvChecked(true);
							setPodcastChecked(true);
							setViralChecked(true);
						}}
						className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline ml-auto"
					>
						{t("buttons.confirm_all") as string}
					</button>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>{t("marketing.types.viral.title") as string}</h2>
					</div>
					<p className="pt-1 text-justify">
						{t("marketing.types.viral.text") as string}
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>{t("marketing.investment") as string} (€)</h3>
							<p>
								{t("marketing.min_invest") as string}: <span className="font-bold">100€</span>
							</p>
							<p>
								{t("marketing.marketing_modif") as string}: <span className="font-bold">1,25</span> +{" "}
								<span className="font-bold">0,1</span> {t("marketing.types.viral.misc") as string}{" "}
								<span className="font-bold">1 000€</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={10000}
								value={viral}
								setValue={setViral}
								checked={viralChecked}
								setChecked={setViralChecked}
								step={10}
								requiredMin={100}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>Out of Home Advertising (OOH)</h2>
					</div>
					<p className="pt-1 text-justify">
						{t("marketing.types.ooh.text") as string}
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>{t("marketing.investment") as string} (€)</h3>
							<p>
								{t("marketing.min_invest") as string}: <span className="font-bold">500€</span>
							</p>
							<p>
								{t("marketing.marketing_modif") as string}: <span className="font-bold">1,50</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={10000}
								value={ooh}
								setValue={setOoh}
								checked={oohChecked}
								setChecked={setOohChecked}
								step={10}
								requiredMin={500}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>{t("marketing.types.billboards.title") as string}</h2>
					</div>
					<p className="pt-1 text-justify">
						{t("marketing.types.billboards.text") as string}
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>{t("marketing.investment") as string} (€)</h3>
							<p>
								{t("marketing.min_invest") as string}: <span className="font-bold">500€</span>
							</p>
							<p>
								{t("marketing.marketing_modif") as string}: <span className="font-bold">1,0</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={10000}
								value={billboard}
								setValue={setBillboard}
								checked={billboardChecked}
								setChecked={setBillboardChecked}
								step={10}
								requiredMin={500}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>{t("marketing.types.tv.title") as string}</h2>
					</div>
					<p className="pt-1 text-justify">
						{t("marketing.types.tv.text") as string}
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>{t("marketing.investment") as string} (€)</h3>
							<p>
								{t("marketing.min_invest") as string}: <span className="font-bold">2 000€</span>
							</p>
							<p>
								{t("marketing.marketing_modif") as string}: <span className="font-bold">1,0</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={10000}
								value={tv}
								setValue={setTv}
								checked={tvChecked}
								setChecked={setTvChecked}
								step={10}
								requiredMin={2000}
							/>
						</div>
					</div>
				</div>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>{t("marketing.types.podcasts.title") as string}</h2>
					</div>
					<p className="pt-1 text-justify">
						{t("marketing.types.podcasts.text") as string}
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>{t("marketing.investment") as string} (€)</h3>
							<p>
								{t("marketing.min_invest") as string}: <span className="font-bold">1 000€</span>
							</p>
							<p>
								{t("marketing.marketing_modif") as string}: <span className="font-bold">1,25</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={10000}
								value={podcast}
								setValue={setPodcast}
								checked={podcastChecked}
								setChecked={setPodcastChecked}
								step={10}
								requiredMin={1000}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Marketing;
