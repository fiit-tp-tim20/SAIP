export type Player = {
	id: string;
	image: string;
	name: string;
};

export type Upgrade = {
	id: number;
	name: string;
	players: string[];
	description: string;
	status: "finished" | "started" | "not started";
	price: number;
	progress: number;
	camera: {
		position: [number, number, number];
		rotation: [number, number, number];
	};
};
