export const getMarketingStats = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/marketing_view/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const data = await response.json();

	return data;
};