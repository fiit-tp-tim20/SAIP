import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UpgradeState {
	upgrades: { [key: string]: number };
	setUpgrade: (upgrade: string, value: number) => void;
	upgradesCheck: { [key: string]: boolean };
	setUpgradeCheck: (upgrade: string, value: boolean) => void;
	reset: () => void;
	getSum: () => number;
}

const useUpgradesStore = create<UpgradeState>()(
	persist(
		(set, get) => ({
			upgrades: {},
			setUpgrade: (upgrade, value) => set((state) => ({ upgrades: { ...state.upgrades, [upgrade]: value } })),
			upgradesCheck: {},
			setUpgradeCheck: (upgrade, value) =>
				set((state) => ({ upgradesCheck: { ...state.upgradesCheck, [upgrade]: value } })),
			reset: () => set(() => ({ upgrades: {} })),
			getSum: () => Object.values(get().upgrades).reduce((a, b) => a + b, 0),
		}),
		{
			name: "upgrades-storage",
		},
	),
);

export default useUpgradesStore;
