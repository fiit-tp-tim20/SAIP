import { create } from "zustand";

interface UpgradeState {
	upgrades: {};
	setUpgrade: (upgrade: string, value: number) => void;
	reset: () => void;
}

const useUpgradesStore = create<UpgradeState>((set) => ({
	upgrades: {},
	setUpgrade: (upgrade, value) => set((state) => ({ upgrades: { ...state.upgrades, [upgrade]: value } })),
	reset: () => set(() => ({ upgrades: {} })),
}));

export default useUpgradesStore;
