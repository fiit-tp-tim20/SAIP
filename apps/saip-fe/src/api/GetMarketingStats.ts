export const getMarketingStats = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/marketing_view/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const data = await response.json();
	if(data.detail){
		localStorage.removeItem("token")
		localStorage.removeItem("expiryDate");
		window.location.reload()
	}

	return data;
};