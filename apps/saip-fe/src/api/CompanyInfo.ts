export const getGeneralInfo = async () => {
	const response = await fetch("http://localhost:8000/company_info/", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const data = await response.json();

	return data;
};
