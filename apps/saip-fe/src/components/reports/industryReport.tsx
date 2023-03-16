import React from "react";
import { useQuery } from "react-query";
import getIndustryReport from "../../api/GetIndustryReport";

function IndustryReport() {
	const { data, isLoading } = useQuery("industryReport", getIndustryReport, {
		refetchOnWindowFocus: false,
	});
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
							<h2>Rebríček všetkých firiem (podľa akcii)</h2>
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
								{Object.entries(data?.industry)
									.sort((a, b) => a[1].stock_price | (0 > b[1].stock_price) | 0)
									.map((industry, index) => (
										<tr className="hover:bg-stone-100">
											<td className="border px-4 py-2 text-center">{index + 1}</td>
											<td className="border px-4 py-2 text-center">{industry[0]}</td>
											<td className="border px-4 py-2 text-center">
												{industry[1].stock_price || 0} €
											</td>
											<td className="border px-4 py-2 text-center">
												{industry[1].net_profit || 0} €
											</td>
											<td className="border px-4 py-2 text-center">{industry[1].sell_price}</td>
											<td className="border px-4 py-2 text-center">{industry[1].market_share}</td>
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
								<th className="border px-4 py-2 bg-accent-500 text-white">Kategória</th>
								<th className="border px-4 py-2 bg-accent-500 text-white">Počet kusov</th>
								<th className="border px-4 py-2 bg-accent-500 text-white">Nárast / pokles</th>
							</thead>
							<tbody>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celkové objednávky</td>
									<td className="border px-4 py-2">100</td>
									<td className="border px-4 py-2">7 %</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celkový predaj</td>
									<td className="border px-4 py-2">100</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celková výroba</td>
									<td className="border px-4 py-2">100</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celková kapacita</td>
									<td className="border px-4 py-2">100</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Celkové zásoby v odvetví</td>
									<td className="border px-4 py-2">100</td>
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
									<td className="border px-4 py-2">100</td>
									<td className="border px-4 py-2">7 %</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Úverový limit</td>
									<td className="border px-4 py-2">100</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Sazdba dane z prijmu</td>
									<td className="border px-4 py-2">100</td>
								</tr>
								<tr className="hover:bg-stone-100">
									<td className="border px-4 py-2">Inflácia</td>
									<td className="border px-4 py-2">100</td>
								</tr>
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}

export default IndustryReport;
