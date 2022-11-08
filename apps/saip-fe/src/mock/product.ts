import { Player, Upgrade } from "../types/product";

export const getUpgrades = (): Upgrade[] => [
	{
		id: 1,
		players: [
			{ id: "1", image: "2", name: "John Deer" },
			{ id: "2", image: "3", name: "Jane Doe" },
			{ id: "3", image: "4", name: "John Doe" },
			{ id: "4", image: "5", name: "Jane Deer" },
			{ id: "5", image: "6", name: "John Deer" },
			{ id: "6", image: "7", name: "Jane Doe" },
		],
		status: "finished",
		price: 12000,
		camera: {
			position: [0, 1, 2],
			rotation: [0, 0, 0],
		},
	},
	{
		id: 2,
		players: [{ id: "", image: "3", name: "Jane Doe" }],
		status: "finished",
		price: 12000,
		camera: {
			position: [1, 2, 2],
			rotation: [0, 0, 0],
		},
	},
	{
		id: 3,
		players: [
			{ id: "2", image: "3", name: "Jane Doe" },
			{ id: "3", image: "4", name: "John Doe" },
			{ id: "4", image: "5", name: "Jane Deer" },
		] as Player[],
		price: 12000,
		progress: 10000,
		status: "pending",
		camera: {
			position: [0, 1, 2],
			rotation: [0, 0, 0],
		},
	},
	{
		id: 5,
		players: [] as Player[],
		price: 17000,
		progress: 7000,
		status: "pending",
		camera: {
			position: [0, 1, 2],
			rotation: [0, 0, 0],
		},
	},
	{
		id: 4,
		players: [{ id: "2", image: "3", name: "Jane Doe" }],
		status: "not_started",
		price: 12000,
		camera: {
			position: [0, 1, 2],
			rotation: [0, 0, 0],
		},
	},
	{
		id: 6,
		players: [{ id: "5", image: "6", name: "John Deer" }],
		status: "not_started",
		price: 12000,
		camera: {
			position: [0, 1, 2],
			rotation: [0, 0, 0],
		},
	},
];
