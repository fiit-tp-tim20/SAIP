const getCompanyReport = async (turn: number) => {
	if (turn === -1) {
		return null;
	}

	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/company_report/?turn=${turn}`, {
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

export default getCompanyReport;
