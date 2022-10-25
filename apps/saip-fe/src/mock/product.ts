export const getResearchedUpgrades = () => {
	return [
		{
			id: 1,
			players: [2],
		},
		{
			id: 2,
			players: [],
		},
	];
};

export const getPendingUpgrades = () => [
	{
		id: 3,
		players: [],
	},
	{
		id: 5,
		players: [],
	},
];

export const getAvailableUpgrades = () => [
	{
		id: 4,
		players: [3],
	},
	{
		id: 6,
		players: [6],
	},
];
