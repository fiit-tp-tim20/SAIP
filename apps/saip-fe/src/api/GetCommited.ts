export const getCommited = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/committed/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const data = await response.json();
	return data.commited;
};
