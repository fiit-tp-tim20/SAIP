import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyState {
	productCount: number;
	productCountChecked: boolean;
	productPrice: number;
	productPriceChecked: boolean;
	capitalInvestments: number;
	capitalInvestmentsChecked: boolean;
	setProductCount: (value: number) => void;
	setProductCountChecked: (value: boolean) => void;
	setProductPrice: (value: number) => void;
	setProductPriceChecked: (value: boolean) => void;
	setCapitalInvestments: (value: number) => void;
	setCapitalInvestmentsChecked: (value: boolean) => void;
	reset: () => void;
	getChecked: () => boolean;
}

const useCompanyStore = create<CompanyState>()(
	persist(
		(set, get) => ({
			productCount: 1,
			productCountChecked: false,
			productPrice: 0,
			productPriceChecked: false,
			capitalInvestments: 0,
			capitalInvestmentsChecked: false,
			setProductCount: (value) => set(() => ({ productCount: value })),
			setProductCountChecked: (value) => set(() => ({ productCountChecked: value })),
			setProductPrice: (value) => set(() => ({ productPrice: value })),
			setProductPriceChecked: (value) => set(() => ({ productPriceChecked: value })),
			setCapitalInvestments: (value) => set(() => ({ capitalInvestments: value })),
			setCapitalInvestmentsChecked: (value) => set(() => ({ capitalInvestmentsChecked: value })),
			reset: () =>
				set(() => ({
					productCount: 1,
					productCountChecked: false,
					productPrice: 0,
					productPriceChecked: false,
					capitalInvestments: 0,
					capitalInvestmentsChecked: false,
				})),
			getChecked: () => get().productCountChecked && get().productPriceChecked && get().capitalInvestmentsChecked,
		}),
		{
			name: "company-storage",
		},
	),
);

export default useCompanyStore;
