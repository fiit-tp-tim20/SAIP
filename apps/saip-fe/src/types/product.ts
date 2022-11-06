export type Player = {
	image: string;
	name: string;
};

export type Upgrade = {
	id: number;
	players: Player[];
	status: "finished" | "pending" | "not_started";
	price: number;
	progress?: number;
	camera: {
		position: [number, number, number];
		rotation: [number, number, number];
	};
};
