import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UpgradeState {
	upgrades: { [key: string]: number };
	setUpgrade: (upgrade: string, value: number) => void;
	reset: () => void;
	getSum: () => number;
}

const useUpgradesStore = create<UpgradeState>()(
	persist(
		(set, get) => ({
			upgrades: {},
			setUpgrade: (upgrade, value) => set((state) => ({ upgrades: { ...state.upgrades, [upgrade]: value } })),
			reset: () => set(() => ({ upgrades: {} })),
			getSum: () => Object.values(get().upgrades).reduce((a, b) => a + b, 0),
		}),
		{
			name: "upgrades-storage",
		},
	),
);

export default useUpgradesStore;
