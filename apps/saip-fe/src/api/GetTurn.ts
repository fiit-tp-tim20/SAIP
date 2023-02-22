export const getTurn = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/end_turn`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	if (response.status === 200) {
		const data = await response.json();
		return data;
	}
	return null;
};
