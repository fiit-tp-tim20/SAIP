import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MarketingState {
	viral: number;
	ooh: number;
	billboard: number;
	tv: number;
	podcast: number;
	setViral: (value: number) => void;
	setOoh: (value: number) => void;
	setBillboard: (value: number) => void;
	setTv: (value: number) => void;
	setPodcast: (value: number) => void;
}

const useMarketingStore = create<MarketingState>()(
	persist(
		(set) => ({
			viral: 0,
			ooh: 0,
			billboard: 0,
			tv: 0,
			podcast: 0,
			setViral: (value) => set(() => ({ viral: value })),
			setOoh: (value) => set(() => ({ ooh: value })),
			setBillboard: (value) => set(() => ({ billboard: value })),
			setTv: (value) => set(() => ({ tv: value })),
			setPodcast: (value) => set(() => ({ podcast: value })),
		}),
		{
			name: "marketing-storage",
		},
	),
);

export default useMarketingStore;
