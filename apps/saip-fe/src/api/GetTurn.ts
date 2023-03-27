export const getTurn = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/turn_info/`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	if (response.status === 200) {
		const data = await response.json();
		return data;
	}

	return null;
};
