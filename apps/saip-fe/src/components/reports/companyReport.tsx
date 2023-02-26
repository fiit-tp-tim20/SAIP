import { useTranslation } from "react-i18next";

function CompanyReport() {
	const { t } = useTranslation();

	return (
		// TODO - breakpoint values

		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
				<h1 className="my-4">Správa o spoločnosti</h1>
				<div className="grid gap-4 xl:grid-cols-3">
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Produckia</h2>
						</div>			
							<table className="table-auto">
								<tbody>
									<tr>
									<td className="border px-4 py-2">Produkcia</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výrobná kapacita</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Utilizácia</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výrobná cena</td>
									<td className="border px-4 py-2">100€</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Inventár</td>
									<td className="border px-4 py-2">100</td>
									</tr>
								</tbody>
								</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Správa o predaji</h2>
						</div>			
							<table className="table-auto">
								<tbody>
									<tr>
									<td className="border px-4 py-2">Prijaté objednávky</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Splnené objednávky</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Nesplnené objednávky</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Predajná cena</td>
									<td className="border px-4 py-2">100€</td>
									</tr>
								</tbody>
							</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Súvaha</h2>
						</div>			
							<table className="table-auto">
								<thead>
									<tr>
									<th className="px-4 py-2">Aktíva</th>
									</tr>
								</thead>
								<tbody>
									<tr>
									<td className="border px-4 py-2">Hotovosť</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Zásoby</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Kapitálové invsetície</td>
									<td className="border px-4 py-2">100</td>
									</tr>
								</tbody>
								<thead>
									<tr>
									<th className="px-4 py-2">Pasíva</th>
									</tr>
								</thead>
								<tbody>
									<tr>
									<td className="border px-4 py-2">Pôžičky</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Nerozdelený zisk</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Vlastné ímanie</td>
									<td className="border px-4 py-2">100</td>
									</tr>
								</tbody>
							</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Cashflow</h2>
						</div>			
							<table className="table-auto">
								{/* <thead>
									<tr>
									<th className="px-4 py-2">Column 1</th>
									<th className="px-4 py-2">Column 2</th>
									</tr>
								</thead> */}
								<tbody>
									<tr>
									<td className="border px-4 py-2">Počiatočná hotovosť</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Kapitálové invstície</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Čistý zisk</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Odpisy</td>
									<td className="border px-4 py-2">100€</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Poplatok za zásoby</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Nové úvery</td>
									<td className="border px-4 py-2">100</td>
									</tr>
								</tbody>
							</table>
					</div>
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Výkaz ziskov a strát</h2>
						</div>			
							<table className="table-auto">
								<tbody>
									<tr>
									<td className="border px-4 py-2">Tržby</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Náklady na predajný tovar</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Marketing</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Poplatok za zásoby</td>
									<td className="border px-4 py-2">100€</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Úrok</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Zisk pred zdanením</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Daň</td>
									<td className="border px-4 py-2">100</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Čistý zisk</td>
									<td className="border px-4 py-2">100</td>
									</tr>
								</tbody>
							</table>
					</div>

				</div>
		</div>
	);
}

export default CompanyReport;