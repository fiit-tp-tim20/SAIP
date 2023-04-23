export type IndustryReport = {
	market_share: number;
	net_profit: number | null;
	sell_price: number;
	stock_price: number | null;
};

export type IndustryReportData = {
	industry: {
		[key: string]: IndustryReport;
	};
	market: {
		capacity: number | null;
		capacity_difference: number | null;
		demand: number | null;
		demand_difference: number | null;
		inventory: number | null;
		inventory_difference: number | null;
		manufactured: number | null;
		manufactured_difference: number | null;
		sold_products: number | null;
		sold_products_difference: number | null;
	};
	economic_parameters: {
		inflation: number | null;
		inflation_difference: number | null;
		interest_rate: number | null;
		interest_rate_difference: number | null;
		loan_limit: number | null;
		loan_limit_difference: number | null;
		tax_rate: number | null;
		tax_rate_difference: number | null;
	};
};

const getIndustryReport = async (turn: number) => {
	if (turn === -1 || turn === 0) {
		return;
	}

	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/industry_report/?turn=${turn}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const data = (await response.json()) as IndustryReportData;
	return data;
};

export default getIndustryReport;
