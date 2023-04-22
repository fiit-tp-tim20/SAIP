export const getCompanyReport = async (turn: number) => {
	if (turn === -1) {
		return;
	}

	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/company_report/?turn=${turn - 1}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const data = await response.json();

	return data;
};
