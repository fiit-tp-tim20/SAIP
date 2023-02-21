import { GameState } from "../types/gameState";

export const endTurn = async (state: GameState) => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/spendings`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			marketing: state.marketing,
			production: {
				sell_price: state.company.productPrice,
				volume: state.company.productCount,
			},
			factory: {
				prod_emp: 0,
				cont_emp: 0,
				aux_emp: 0,
				capital: state.company.capitalInvestments,
			},
			brakes: state.upgrades.brakes,
			frame: state.upgrades.frame,
			battery: state.upgrades.battery,
			display: state.upgrades.display,
		}),
	});
};
