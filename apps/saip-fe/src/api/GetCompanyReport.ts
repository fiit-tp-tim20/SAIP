export const getCompanyReport = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/company_report/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const data = await response.json();

	return data;
};