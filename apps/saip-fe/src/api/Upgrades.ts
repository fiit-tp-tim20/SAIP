import { Upgrade } from "../types/product";

export const getUpgrades = async () => {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upgrades/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const rawData = (await response.json()).upgrade;

	// TODO add upgrade DTO
	const data: Upgrade[] = rawData.map((upgrade: any) => ({
		...upgrade,
		camera: {
			position: upgrade.camera_pos,
			rotation: upgrade.camera_rot,
		},
	}));

	return data;
};
