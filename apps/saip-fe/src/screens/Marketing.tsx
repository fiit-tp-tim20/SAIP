import React from "react";
import Slider from "../components/slider/Slider";
import useMarketingStore from "../store/Marketing";
import { getMarketingStats } from "../api/GetMarketingStats";
import MarketingGraph from "../components/statisticsGraph/MarketingGraph";
import { useQuery } from "react-query";

function Marketing() {
	const { isLoading, data } = useQuery(["getMarketingStats"], getMarketingStats);

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
			<h1 className="my-4">Štatistiky</h1>
			<div className="background-container my-2 flex flex-col rounded-2xl p-6">
				{isLoading ? <div>Loading...</div> : <MarketingGraph data={data?.demand} />}
			</div>

			<div className="flex flex-col">
				<h1 className="my-4">Typy marketingu</h1>
				<div className="background-container my-2 flex flex-col rounded-2xl p-6">
					<div className="flex flex-row items-center justify-between py-2">
						<h2>Virálny marketing</h2>
					</div>
					<p className="pt-1">
						Informácie o produktoch šírené pomocou elektronických médií, najmä sociálnych sietí, ale aj
						pomocou virálneho priestoru ako súčasť zábavy, hier, či web stránok.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>Investícia (€)</h3>
							<p>
								Minimum: <span className="font-bold">100€</span> 
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={5000}
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
						<h2>OOH</h2>
					</div>
					<p className="pt-1">
						Kombinácia vynúteného vnímania bilbordovej reklamy umiestňovanej na miestach, kde sa musia
						zdržiavať klienti ako je napr MHD, zastávky, čakárne v kombinácii s virálnym, televíznym alebo
						podcastovým marketingom, kde bilbord človeka upúta a základné informuje a nálendá reklama vynúti
						pozornosť až natoľko, že klient aktívne hľadá bližšie informácie o produkte.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>Investícia (€)</h3>
							<p>
								Minimum: <span className="font-bold">500€</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={5000}
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
						<h2>Billboardy</h2>
					</div>
					<p className="pt-1">
						Tlačená vonkajšia reklama obyčajne veľký rozmer, ale môžem mať aj podobu citylightu.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>Investícia (€)</h3>
							<p>
								Minimum: <span className="font-bold">500€</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={5000}
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
						<h2>Televízia</h2>
					</div>
					<p className="pt-1">
						Klasická televízna reklama vysielaná pomocou v terestriálnej ale streamovacej siete televíznych
						programov.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>Investícia (€)</h3>
							<p>
								Minimum: <span className="font-bold">2000€</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={5000}
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
						<h2>Podcasty</h2>
					</div>
					<p className="pt-1">
						Marketingové aktivity ako súčasť nahratých rozhovorov v rámci cyklov či jednorazových aktivít
						médií, či vysielaní rozhlasu alebo televízií.
					</p>
					<div className="flex flex-row items-center justify-between py-2">
						<div className="flex flex-col">
							<h3>Investícia (€)</h3>
							<p>
								Minimum: <span className="font-bold">1000€</span>
							</p>
						</div>
						<div>
							<Slider
								min={0}
								max={5000}
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
