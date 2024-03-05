import React, {useContext, useState} from "react";
import { useQuery } from "react-query";
import getArchiveReport from "../../api/GetArchiveReport";
import numberWithSpaces from "../../utils/numberWithSpaces";
// @ts-ignore
import {MyContext} from "../../api/MyContext.js";
import getCompanyReport from "../../api/GetCompanyReport";


function ArchiveReport() {
    const dataWs = useContext(MyContext);
    // @ts-ignore
    const TURN = dataWs.num
    // @ts-ignore
    const [turn, setTurn] = useState<number>(dataWs.num - 1);
    const { isLoading, data } = useQuery(["archiveReport", turn], () => getArchiveReport(turn));

    // poradie
    return (
        <div className="flex w-[600px] flex-col md:w-[900px] xl:w-[1280px]">
            <div className="flex flex-row justify-between">
                <h1 className="my-4">Archív rozhodnutí</h1>
                <div>
                    <label htmlFor="turn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Pre kolo
                    </label>
                    <select
                        id="turn"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={turn}
                        onChange={(e) => setTurn(parseInt(e.target.value, 10))}
                    >
                        {[...Array(TURN).keys()].map((o) => {
                            if (o === 0) return null;
                            return <option value={o}>{o}</option>;
                        })}
                    </select>
                </div>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div className="grid gap-4 xl:grid-cols-2">
                        <div className="background-container my-2 flex flex-col rounded-2xl p-6">
                            <div className="flex flex-row items-center justify-between py-2">
                                <h2>Archív marketingu</h2>
                            </div>
                            <table className="table-auto table-white">
                                <tbody>
                                <tr>

                                    <th className="px-4 py-2">Kolo</th>
                                    <th className="px-4 py-2">VM</th>
                                    <th className="px-4 py-2">OOH</th>
                                    <th className="px-4 py-2">BILL</th>
                                    <th className="px-4 py-2">TV</th>
                                    <th className="px-4 py-2">PODC</th>
                                </tr>
                                {[...Array(turn).keys()].map(( turn) => (
                                    <tr key={turn}>
                                        <td className="px-4 py-2">{turn + 1}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.marketing.viral[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.marketing.ooh[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.marketing.billboard[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.marketing.tv[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.marketing.podcast[turn])} €
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="background-container my-2 flex flex-col rounded-2xl p-6">
                            <div className="flex flex-row items-center justify-between py-2">
                                <h2>Archív produkcie</h2>
                            </div>
                            <table className="table-auto table-white">
                                <tbody>
                                <tr>

                                    <th className="px-4 py-2">Kolo</th>
                                    <th className="px-4 py-2">volume</th>
                                    <th className="px-4 py-2">man_cost</th>
                                    <th className="px-4 py-2">man_cost_all</th>
                                    <th className="px-4 py-2">sell_price</th>

                                </tr>
                                {[...Array(turn).keys()].map(( turn) => (
                                    <tr key={turn}>
                                        <td className="px-4 py-2">{turn + 1}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.production.volume[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.production.man_cost[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.production.man_cost_all[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.production.sell_price[turn])} €
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid gap-4 xl:grid-cols-1">
                        <div className="background-container my-2 flex flex-col rounded-2xl p-6">
                            <div className="flex flex-row items-center justify-between py-2">
                                <h2>Archív cashFlow</h2>
                            </div>
                            <table className="table-auto table-white">
                                <tbody>
                                <tr>

                                    <th className="px-4 py-2">Kolo</th>
                                    <th className="px-4 py-2">sales</th>
                                    <th className="px-4 py-2">manufMcost</th>
                                    <th className="px-4 py-2">inv_charge</th>
                                    <th className="px-4 py-2">interest</th>
                                    <th className="px-4 py-2">tax</th>
                                    <th className="px-4 py-2">CF_R</th>
                                    <th className="px-4 py-2">loan_new</th>
                                    <th className="px-4 py-2">loan_rep</th>
                                    <th className="px-4 py-2">cash</th>
                                </tr>
                                {[...Array(turn).keys()].map(( turn) => (
                                    <tr key={turn}>
                                        <td className="px-4 py-2">{turn + 1}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.sales[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.manufactured_man_cost[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.inventory_charge[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.interest[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.tax[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.cash_flow_result[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.new_loans[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.loan_repayment[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.cash_flow.cash[turn])} €
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="background-container my-2 flex flex-col rounded-2xl p-6">
                            <div className="flex flex-row items-center justify-between py-2">
                                <h2>Archív zostatoku financií</h2>
                            </div>
                            <table className="table-auto table-white">
                                <tbody>
                                <tr>

                                    <th className="px-4 py-2">Kolo</th>
                                    <th className="px-4 py-2">cash</th>
                                    <th className="px-4 py-2">inv_money</th>
                                    <th className="px-4 py-2">assets_summ</th>
                                    <th className="px-4 py-2">loans</th>
                                    <th className="px-4 py-2">ret_ear</th>
                                    <th className="px-4 py-2">base_cap</th>
                                    <th className="px-4 py-2">liab_summ</th>
                                    <th className="px-4 py-2">cap_inv</th>

                                </tr>
                                {[...Array(turn).keys()].map(( turn) => (
                                    <tr key={turn}>
                                        <td className="px-4 py-2">{turn + 1}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.cash[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.inventory_money[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.assets_summary[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.loans[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.ret_earnings[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.base_capital[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.liabilities_summary[turn])} €
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {numberWithSpaces(data.balance.capital_investments[turn])} €
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>
            )}
        </div>
    );
}

export default ArchiveReport;