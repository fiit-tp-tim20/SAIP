import React from "react";

function IndustryReport() {
	// poradie
	return (
		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
			<h1 className="my-4">Industry report</h1>
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
						<tr className="hover:bg-stone-100">
							<td className="border px-4 py-2 text-center">1</td>
							<td className="border px-4 py-2 text-center">Commited Inc.</td>
							<td className="border px-4 py-2 text-center">1000€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">10%</td>
						</tr>
						<tr className="hover:bg-stone-100">
							<td className="border px-4 py-2 text-center">2</td>
							<td className="border px-4 py-2 text-center">Holo Inc.</td>
							<td className="border px-4 py-2 text-center">8000€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">20%</td>
						</tr>
						<tr className="hover:bg-stone-100">
							<td className="border px-4 py-2 text-center">3</td>
							<td className="border px-4 py-2 text-center">HolTek Inc.</td>
							<td className="border px-4 py-2 text-center">2500€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">30%</td>
						</tr>
						<tr className="hover:bg-stone-100">
							<td className="border px-4 py-2 text-center">4</td>
							<td className="border px-4 py-2 text-center">ZET Inc.</td>
							<td className="border px-4 py-2 text-center">9999€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">40%</td>
						</tr>
						<tr className="hover:bg-stone-100">
							<td className="border px-4 py-2 text-center">5</td>
							<td className="border px-4 py-2 text-center">ALL*Star Inc.</td>
							<td className="border px-4 py-2 text-center">4269€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">50%</td>
						</tr>
						<tr className="hover:bg-stone-100">
							<td className="border px-4 py-2 text-center">6</td>
							<td className="border px-4 py-2 text-center">Mucka Inc.</td>
							<td className="border px-4 py-2 text-center">5000€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">1234€</td>
							<td className="border px-4 py-2 text-center">60%</td>
						</tr>
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
		</div>
	);
}

export default IndustryReport;
