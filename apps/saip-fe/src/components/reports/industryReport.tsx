import { use } from "i18next";
import React from "react";
import { useQuery } from "react-query";
import getIndustryReport from "../../api/GetIndustryReport";
import { getIndustryGraphData } from "../../api/GetIndustryGraphData";
import IndustryGraph from "../statisticsGraph/IndustryGraph";
import numberWithSpaces from "../../utils/numberWithSpaces";

function IndustryReport() {
	const { data, isLoading } = useQuery(["getIndustryReport"], getIndustryReport);
	const { data: graphData, isLoading: isLoading2 } = useQuery(["getIndustryGraphData"], getIndustryGraphData);

	// poradie
	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<h1 className="my-4">Industry report</h1>
			{isLoading ? (
				<p>a</p>
			) : (
				<>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Rebríček všetkých firiem (podľa akcií)</h2>
						</div>
						<table className="table-auto">
							<thead>
								<tr>
									<th className="border px-4 py-2 bg-accent-500"> </th>
									<th className="border px-4 py-2 bg-accent-500 text-white">Spoločnosť</th>
									<th className="border px-4 py-2 bg-accent-500 text-white">Hodnota jednej akcie</th>
									<th className="border px-4 py-2 bg-accent-500 text-white">
										Výsledok hospodárenia po zdanení
									</th>
									<th className="border px-4 py-2 bg-accent-500 text-white">Predajná cena</th>
									<th className="border px-4 py-2 bg-accent-500 text-white">Podiel na trhu</th>
								</tr>
							</thead>
							<tbody>
								{/* TODO add sort */}
								{data &&
									Object.entries(data?.industry).map((industry, index) => (
										<tr key={industry[0]} className="hover:bg-stone-100">
											<td className="border px-4 py-2 text-center">{index + 1}</td>
											<td className="border px-4 py-2 text-center">{industry[0]}</td>
											<td className="border px-4 py-2 text-center">
												{numberWithSpaces(industry[1].stock_price)} €
											</td>
											<td className="border px-4 py-2 text-center">
												{numberWithSpaces(industry[1].net_profit)} €
											</td>
											<td className="border px-4 py-2 text-center">
												{numberWithSpaces(industry[1].sell_price)} €/ks
											</td>
											<td className="border px-4 py-2 text-center">
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
						<table className="table-auto">
							<thead>
								<tr>
									<th className="border px-4 py-2 bg-accent-500 text-white">Kategória</th>
									<th className="border px-4 py-2 bg-accent-500 text-white">Hodnota</th>
									<th className="border px-4 py-2 bg-accent-500 text-white">Nárast / pokles</th>
								</tr>
							</thead>
							<tbody>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celkové objednávky</td>
									<td className="border px-4 py-2">{numberWithSpaces(data?.market.demand)}</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.market.demand_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celkový predaj</td>
									<td className="border px-4 py-2">{numberWithSpaces(data?.market.sold_products)}</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.market.sold_products_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celková výroba</td>
									<td className="border px-4 py-2">{numberWithSpaces(data?.market.manufactured)}</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.market.manufactured_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celková kapacita</td>
									<td className="border px-4 py-2">{numberWithSpaces(data?.market.capacity)}</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.market.capacity_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celkové zásoby v odvetví</td>
									<td className="border px-4 py-2">{numberWithSpaces(data?.market.inventory)}</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.market.inventory_difference)} %
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Ekonomické parametre trhu</h2>
						</div>
						<table className="table-auto">
							<thead>
								<th className="border px-4 py-2 bg-accent-500 text-white">Parameter</th>
								<th className="border px-4 py-2 bg-accent-500 text-white">Hodnota</th>
								<th className="border px-4 py-2 bg-accent-500 text-white">Nárast / pokles</th>
							</thead>
							<tbody>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Úroková sadzba</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.interest_rate)} %
									</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.interest_rate_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Úverový limit</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.loan_limit)} €
									</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.loan_limit_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Sazdba dane z prijmu</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.tax_rate)} %
									</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.tax_rate_difference)} %
									</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Inflácia</td>
									<td className="border px-4 py-2">
										{numberWithSpaces(data?.economic_parameters.inflation)} %
									</td>
									<td className="border px-4 py-2">
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
							<IndustryGraph rank={graphData?.rank} stock_price={graphData?.stock_price} />
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default IndustryReport;
