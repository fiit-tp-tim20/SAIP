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
							<h2>Správa o výrobe</h2>
						</div>
							<table className="table-auto">
								<tbody>
									<tr>
									<td className="border px-4 py-2">Vyrobené množstvo</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.production} ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výrobná kapacita (max)</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.capacity} ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Koeficient využitia výrobnej kapacity</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.utilization} %</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Variabilné náklady</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.man_cost} €/ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Zásoby</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.new_inventory} ks</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Celkové náklady</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.production.man_cost_all} €/ks</td>
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
									<td className="border px-4 py-2">Kapitálové investície</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.capital_investments} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2"><b>Súčet aktív</b></td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.assets_summary} €</td>
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
									<td className="border px-4 py-2">Základné ímanie</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.base_capital} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2"><b>Súčet pasív</b></td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.balance.liabilities_summary} €</td>
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
									<td className="border px-4 py-2">Počiatočný stav</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.beginning_cash} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Príjmy z predaja výrobkov</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.sales} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výdavky na vyrobené výrobky</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.manufactured_man_cost} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výdavky na rozhodnutia</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.expenses} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2"> Výdavky na úroky</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.interest} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Zaplatená daň</td>
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
										<td className="border px-4 py-2">Splátka úveru</td>
										<td className="border px-4 py-2 whitespace-nowrap">{data.cash_flow.loan_repayment} €</td>
										</tr>
									)}
									<tr>
									<td className="border px-4 py-2"><b>Konečný stav</b></td>
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
									<td className="border px-4 py-2">Tržby z predaja výrobkov</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.sales} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Výrobné náklady</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.manufactured_man_cost} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Náklady na marketing</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.marketing} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Náklady na výskum a vývoj</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.r_d} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Odpisy</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.depreciation} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Dodatočné náklady na nepredané výrobky</td>
									<td className="border px-4 py-2 whitespace-nowrap">{data.income_statement.inventory_charge} €</td>
									</tr>
									<tr>
									<td className="border px-4 py-2">Nákladové úroky</td>
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