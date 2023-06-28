import { Upgrade } from "../types/product";

type UpgradeDTO = {
	name: string;
	description: string;
	price: number;
	progress: number;
	camera_pos: [string, string, string];
	camera_rot: [string, string, string];
	players: [];
	status: "finished" | "started" | "not started";
};

const getUpgrades = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upgrades/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const rawData = (await response.json()).upgrade as UpgradeDTO[];

	const data: Upgrade[] = rawData.map((upgrade) => ({
		...upgrade,
		camera: {
			position: upgrade.camera_pos.map((pos) => Number(pos)) as [number, number, number],
			rotation: upgrade.camera_rot.map((rot) => Number(rot)) as [number, number, number],
		},
	}));

	return data;
};

export default getUpgrades;
