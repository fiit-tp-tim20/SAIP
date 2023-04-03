import React from "react";
import Slider from "../components/slider/Slider";
import useCompanyStore from "../store/Company";
import { useQuery } from "react-query";
import { getCompanyStats } from "../api/GetCompanyStats";
import { getCompanyReport } from "../api/GetCompanyReport";
import CompanyGraph from "../components/statisticsGraph/CompanyGraph";

function Company() {
	const { isLoading: statsIsLoading, data: statsData } = useQuery(["getCompanyStats"], getCompanyStats);
	const { isLoading: reportIsLoading, data: reportData } = useQuery(["companyReport"], getCompanyReport);
	console.log(reportData);

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
					</div>
					<p className="pt-1">
						Počet produkovaných kusov je počet kusov, ktoré sa vyrobia v určitom časovom období.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Počet kusov</h3>
						<div>
							<Slider
								min={1}
								max={reportData.production.capacity}
								value={productCount}
								setValue={setProductCount}
								checked={productCountChecked}
								setChecked={setProductCountChecked}
								step={10}
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl my-2">
					<div className="py-2 flex flex-row items-center justify-between">
						<h2>Predajná cena</h2>
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
						<h3>Predajná cena</h3>
						<div>
							<Slider
								min={0}
								max={1000}
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
					</div>
					<p className="pt-1">
						Investície do kapitálu sú investície do majetku, ktoré sa používajú na výrobu produktov. Je
						dôležité vykonať dôkladnú analýzu a zvážiť všetky faktory, ako je napríklad história podnikania,
						finančná situácia, a perspektíva budúceho vývoja, pred rozhodnutím investovať do kapitálu.
					</p>
					<div className="py-2 flex flex-row items-center justify-between">
						<h3>Investícia</h3>
						<div>
							<Slider
								min={0}
								max={1000}
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
