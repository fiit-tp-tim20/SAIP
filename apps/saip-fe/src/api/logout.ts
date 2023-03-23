const logout = async (marketingReset: () => void, companyReset: () => void, upgradesReset: () => void) => {
	await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout/`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			"Content-Type": "application/json",
		},
	});

	localStorage.removeItem("token");
	localStorage.removeItem("expiryDate");
	marketingReset();
	companyReset();
	upgradesReset();
	window.location.reload();
};

export default logout;
