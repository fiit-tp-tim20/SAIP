type IndustryReportData = {
	industry: {
		[key: string]: {
			market_share: number;
			net_profit: number | null;
			sell_price: number;
			stock_price: number | null;
		};
	};
	market: any;
	exonomic_parameters: any;
};

const getIndustryReport = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/industry_report/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const data = (await response.json()) as IndustryReportData;
	console.warn(Object.entries(data.industry));
	return data;
};

export default getIndustryReport;
