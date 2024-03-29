const getGeneralInfo = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/company_info/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const data = await response.json();

	return data;
};

export default getGeneralInfo;
