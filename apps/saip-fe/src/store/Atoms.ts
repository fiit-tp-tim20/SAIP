import { atom } from "jotai";

const totalSpent = atom(0);

const totalSpentPersist = atom(
	(get) => get(totalSpent),
	(get, set, update: number) => {
		set(totalSpent, update);
	},
);

const currentTurn = atom(-1);

export { totalSpent, totalSpentPersist, currentTurn };
