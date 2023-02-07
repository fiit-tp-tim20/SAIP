import { Upgrade } from "../types/product";

export const getUpgrades = async () => {
	const response = await fetch("http://localhost:8000/upgrades/", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const rawData = (await response.json()).upgrade;

	// TODO add upgrade DTO
	const data: Upgrade[] = rawData.map((upgrade: any) => {
		return {
			...upgrade,
			camera: {
				position: upgrade.camera_pos,
				rotation: upgrade.camera_rot,
			},
		};
	});

	return data;
};
