export const getIndustryGraphData = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/industry_view/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const data = await response.json();

	return data;
};
