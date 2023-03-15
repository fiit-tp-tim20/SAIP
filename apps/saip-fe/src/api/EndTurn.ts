import { GameState } from "../types/gameState";

export const endTurn = async (state: GameState) => {
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
			brakes: state.upgrades.brakes,
			frame: state.upgrades.frame,
			battery: state.upgrades.battery,
			display: state.upgrades.display,
		}),
	});
};
