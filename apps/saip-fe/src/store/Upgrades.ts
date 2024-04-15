import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UpgradeState {
	upgrades: { [key: string]: number };
	setUpgrade: (upgrade: string, value: number) => void;
	upgradesCheck: { [key: string]: boolean };
	setUpgradeCheck: (upgrade: string, value: boolean) => void;
	reset: () => void;
	getSum: () => number;
	getChecked: () => boolean;
}

const useUpgradesStore = create<UpgradeState>()(
	persist(
		(set, get) => ({
			upgrades: {},
			setUpgrade: (upgrade, value) => set((state) => ({ upgrades: { ...state.upgrades, [upgrade]: value } })),
			upgradesCheck: {}, // Initialize upgradesCheck with default values of false
			setUpgradeCheck: (upgrade, value) =>
				set((state) => ({ upgradesCheck: { ...state.upgradesCheck, [upgrade]: value } })),
			reset: () => set(() => ({ upgrades: {}, upgradesCheck: {} })), // Reset upgradesCheck along with upgrades
			getSum: () => Object.values(get().upgrades).reduce((a, b) => a + b, 0),
			getChecked: () => {
				const checkedValues = Object.values(get().upgradesCheck);
				if (checkedValues.length > 0) {
					return (
						checkedValues.every((value) => value) ||
						Object.keys(get().upgrades).some((upgrade) => get().upgrades[upgrade] === "finished")
					);
				}
				// Check if all upgrades are checked
				return false;
			},
		}),
		{
			name: "upgrades-storage",
		},
	),
);

export default useUpgradesStore;
