import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MarketingState {
	viral: number;
	viralChecked: boolean;
	ooh: number;
	oohChecked: boolean;
	billboard: number;
	billboardChecked: boolean;
	tv: number;
	tvChecked: boolean;
	podcast: number;
	podcastChecked: boolean;
	setViral: (value: number) => void;
	setViralChecked: (value: boolean) => void;
	setOoh: (value: number) => void;
	setOohChecked: (value: boolean) => void;
	setBillboard: (value: number) => void;
	setBillboardChecked: (value: boolean) => void;
	setTv: (value: number) => void;
	setTvChecked: (value: boolean) => void;
	setPodcast: (value: number) => void;
	setPodcastChecked: (value: boolean) => void;
	reset: () => void;
	getSum: () => number;
	getChecked: () => boolean;
}

const useMarketingStore = create<MarketingState>()(
	persist(
		(set, get) => ({
			viral: 0,
			viralChecked: false,
			ooh: 0,
			oohChecked: false,
			billboard: 0,
			billboardChecked: false,
			tv: 0,
			tvChecked: false,
			podcast: 0,
			podcastChecked: false,
			setViral: (value) => set(() => ({ viral: value })),
			setViralChecked: (value) => set(() => ({ viralChecked: value })),
			setOoh: (value) => set(() => ({ ooh: value })),
			setOohChecked: (value) => set(() => ({ oohChecked: value })),
			setBillboard: (value) => set(() => ({ billboard: value })),
			setBillboardChecked: (value) => set(() => ({ billboardChecked: value })),
			setTv: (value) => set(() => ({ tv: value })),
			setTvChecked: (value) => set(() => ({ tvChecked: value })),
			setPodcast: (value) => set(() => ({ podcast: value })),
			setPodcastChecked: (value) => set(() => ({ podcastChecked: value })),
			reset: () =>
				set(() => ({
					viral: 0,
					viralChecked: false,
					ooh: 0,
					oohChecked: false,
					billboard: 0,
					billboardChecked: false,
					tv: 0,
					tvChecked: false,
					podcast: 0,
					podcastChecked: false,
				})),
			getSum: () => get().viral + get().ooh + get().billboard + get().tv + get().podcast,
			getChecked: () =>
				get().viralChecked &&
				get().oohChecked &&
				get().billboardChecked &&
				get().tvChecked &&
				get().podcastChecked,
		}),
		{
			name: "marketing-storage",
		},
	),
);

export default useMarketingStore;
