export type Player = {
	image: string;
	name: string;
};

export const getResearchedUpgrades = () => [
	{
		id: 1,
		players: [
			{ image: "2", name: "John Deer" },
			{ image: "3", name: "Jane Doe" },
			{ image: "4", name: "John Doe" },
			{ image: "5", name: "Jane Deer" },
			{ image: "6", name: "John Deer" },
			{ image: "7", name: "Jane Doe" },
		],
	},
	{
		id: 2,
		players: [{ image: "3", name: "Jane Doe" }],
	},
];

export const getPendingUpgrades = () => [
	{
		id: 3,
		players: [
			{ image: "3", name: "Jane Doe" },
			{ image: "4", name: "John Doe" },
			{ image: "5", name: "Jane Deer" },
		] as Player[],
		progressMax: 12000,
		progressValue: 10000,
	},
	{
		id: 5,
		players: [] as Player[],
		progressMax: 17000,
		progressValue: 7000,
	},
];

export const getAvailableUpgrades = () => [
	{
		id: 4,
		players: [{ image: "3", name: "Jane Doe" }],
	},
	{
		id: 6,
		players: [{ image: "6", name: "John Deer" }],
	},
];
