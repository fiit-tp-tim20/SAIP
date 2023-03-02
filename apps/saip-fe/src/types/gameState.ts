export type GameState = {
	upgrades: {
		[key: string]: number;
	};
	company: {
		productCount: number;
		productPrice: number;
		capitalInvestments: number;
	};
	marketing: {
		viral: number;
		ooh: number;
		billboard: number;
		tv: number;
		podcast: number;
	};
};
