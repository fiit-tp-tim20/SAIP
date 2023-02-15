import { create } from "zustand";

interface UpgradeState {
	upgrades: {};
	setUpgrade: (upgrade: string, value: number) => void;
	reset: () => void;
	getSum: () => number;
}

const useUpgradesStore = create<UpgradeState>((set, get) => ({
	upgrades: {},
	setUpgrade: (upgrade, value) => set((state) => ({ upgrades: { ...state.upgrades, [upgrade]: value } })),
	reset: () => set(() => ({ upgrades: {} })),
	getSum: () => Object.values(get().upgrades).reduce((a, b) => a + b, 0),
}));

export default useUpgradesStore;
