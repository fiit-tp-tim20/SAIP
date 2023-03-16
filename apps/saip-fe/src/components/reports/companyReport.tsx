import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getCompanyReport } from "../../api/GetCompanyReport";

function CompanyReport() {
	const { t } = useTranslation();

	const { isLoading, data } = useQuery(["companyReport"], getCompanyReport);



	return (
		// TODO - breakpoint values

		<div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
				<h1 className="my-4">Správa o spoločnosti</h1>
				{isLoading ? (
					<p>Loading...</p>
				) : (
				<div className="grid gap-4 xl:grid-cols-3">
					<div className="background-container my-2 flex flex-col rounded-2xl p-6">
						<div className="flex flex-row items-center justify-between py-2">
							<h2>Produckia</h2>
						</div>
							<table className="table-auto">
								<tbody>
									<tr>
									<td className="border px-4 py-2">Produkcia</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.production} ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výrobná kapacita</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.capacity} ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Utilizácia</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.utilization} %</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výrobná cena</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.man_cost} €/ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Inventár</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.new_inventory} ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Predajná cena</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.selling_price} €/ks</td>
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
									<td className="border px-4 py-2 whitespace-nowrap">{data.sales.orders_received}</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Splnené objednávky</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.sales.orders_fulfilled}</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Nesplnené objednávky</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.sales.orders_unfulfilled}</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Predajná cena</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.sales.selling_price} €/ks</td>
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
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.cash} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Zásoby</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.inventory_money} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Kapitálové invsetície</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.capital_investments} €</td>
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
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.loans} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výsledok hospodárenia z predchádzajúcich období</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.ret_earnings} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Vlastné ímanie</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.base_capital} €</td>
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
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.beginning_cash} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Zisk z predaja</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.sales} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Náklady na predaný tovar</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.sold_man_cost} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výdavky na rozhodnutia</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.expenses} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Úrok</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.interest} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Daň</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.tax} €</td>
									</tr>
									{/* Sem hrubá čiara a výsledok */}
									<tr>
									<td className="border px-4 py-2"><b>Výsledok finančného toku</b></td>
									<td className="border px-4 py-2 whitespace-nowrap"><b>{data.cash_flow.cash_flow_result} €</b></td>
									</tr>
									{data.cash_flow.new_loans > 0 ? (

										<tr>
										<td className="border px-4 py-2">Nové úvery</td>
										<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.new_loans} €</td>
										</tr>
									) :
									(
										<tr>
										<td className="border px-4 py-2">Splátka</td>
										<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.loan_repayment} €</td>
										</tr>
									)}
									<tr>
									<td className="border px-4 py-2"><b>Konečná hotovosť</b></td>
									<td className="border px-4 py-2 whitespace-nowrap"><b>{data.cash_flow.cash} €</b></td>
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
									<td className="border px-4 py-2">Zisk z predaja</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.sales} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Náklady na predaný tovar</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.sold_man_cost} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Marketing</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.marketing} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výskum a vývoj</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.r_d} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Odpisy</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.depreciation} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Poplatok za zásoby</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.inventory_charge} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Úrok</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.interest} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2"><b>Výsledok hospodárenia pred zdanením</b></td>
									<td className="border px-4 py-2 whitespace-nowrap"><b>{data.income_statement.profit_before_tax} €</b></td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Daň</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.tax} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2"><b>Výsledok hospodárenia po zdanení</b></td>
									<td className="border px-4 py-2 whitespace-nowrap"><b>{data.income_statement.sales} €</b></td>
									</tr>
								</tbody>
							</table>
					</div>
				</div>
				)
			}
		</div>
	);
}

export default CompanyReport;