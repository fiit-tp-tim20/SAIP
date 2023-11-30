import { GameState } from "../types/gameState";

const endTurn = async (state: GameState) => {
	const token = localStorage.getItem("token");

	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/spendings/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			marketing: state.marketing,
			production: {
				sell_price: state.company.productPrice,
				volume: state.company.productCount,
			},
			factory: {
				capital: state.company.capitalInvestments,
			},
			brakes: state.upgrades.Brakes,
			frame: state.upgrades.Frame,
			battery: state.upgrades.Battery,
			display: state.upgrades.Display,
		}),
	});
	localStorage.removeItem("committed");

	// const data = await response.json();
	// return data;
};

export default endTurn;
