import { useTranslation } from "react-i18next";

function IndustryReport() {
	const { t } = useTranslation();

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
                                <th className="border px-4 py-2 bg-gray-300">Poradie</th>
                                <th className="border px-4 py-2 bg-gray-300">Akcia</th>
                                <th className="border px-4 py-2 bg-gray-300">Net profit</th>
                                <th className="border px-4 py-2 bg-gray-300">Predajná cena</th>
                                <th className="border px-4 py-2 bg-gray-300">Výsledok hospodárenia</th>
                                <th className="border px-4 py-2 bg-gray-300">Tržby</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-stone-100">
                                <td className="border px-4 py-2 text-center">Commited Inc.</td>
                                <td className="border px-4 py-2 text-center">%</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                            </tr>
                            <tr className="hover:bg-stone-100">
                                <td className="border px-4 py-2 text-center">Holo Inc.</td>
                                <td className="border px-4 py-2 text-center">%</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                            </tr>
                            <tr className="hover:bg-stone-100">
                                <td className="border px-4 py-2 text-center">HolTek Inc.</td>
                                <td className="border px-4 py-2 text-center">%</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                            </tr>
                            <tr className="hover:bg-stone-100">
                                <td className="border px-4 py-2 text-center">ZET Inc.</td>
                                <td className="border px-4 py-2 text-center">%</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                            </tr>
                            <tr className="hover:bg-stone-100">
                                <td className="border px-4 py-2 text-center">ALL*Star Inc.</td>
                                <td className="border px-4 py-2 text-center">%</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                            </tr>
                            <tr className="hover:bg-stone-100">
                                <td className="border px-4 py-2 text-center">Mucka Inc.</td>
                                <td className="border px-4 py-2 text-center">%</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                                <td className="border px-4 py-2 text-center">1234</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
        );
    }
    
export default IndustryReport;