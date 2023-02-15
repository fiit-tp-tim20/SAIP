import React, { useEffect } from "react";
import { X } from "react-feather";
import { useTranslation } from "react-i18next";
import { Vector3 } from "three";
import useUpgradesStore from "../../store/Upgrades";
import { Upgrade } from "../../types/product";
import Slider from "../slider/Slider";
import Canvas from "../three/Canvas";

type Props = {
	upgrade: Upgrade;
	onClick?: () => void;
};

function ProductModal(props: Props) {
	const { upgrade, onClick } = props;
	const { t } = useTranslation();

	const { upgrades, setUpgrade } = useUpgradesStore();
	console.log(upgrade);

	console.log(upgrades);

	useEffect(() => {
		console.log("UPGRADE", upgrade);
		console.log("UPGRADES", upgrades[upgrade.name]);
	}, [upgrade, upgrades]);

	return (
		<div className="background-container rounded-2xl p-6 grid grid-cols-2 gap-6 max-w-5xl min-h-[50vh] max-h-[95vh]">
			<div className="flex flex-col max-h-[90vh] overflow-scroll scrollbar-hide">
				<div className="py-2">
					<h2 className="pb-2">{upgrade.name}</h2>
					<p>{t(`research.features.${upgrade.id}.text`) as string}</p>
				</div>
				<div className="py-2">
					<h4>{t(`research.playerResearched.title`) as string}</h4>
					{upgrade.players.length === 0 && <p>Žiaden z hráčov zatiaľ nedokončil toto vylepšenie</p>}
					{upgrade.players.map((player) => (
						<div
							key={player}
							className="flex items-center p-3 my-1 rounded-2xl bg-gray-200 dark:bg-[#242424]"
						>
							<div className="avatar pr-4">
								<div className="w-8 rounded-full ring ring-accent-400 ring-offset-base-100 ring-offset-2">
									<img
										src={`https://avatars.dicebear.com/api/miniavs/${player}.png`}
										alt={player}
										className="w-8 h-8 rounded-full mr-2 bg-gray-200"
									/>
								</div>
							</div>
							<p>{player}</p>
						</div>
					))}
				</div>
				<div className="py-2 flex flex-row items-center justify-between">
					<h4>{t(`research.price.title`) as string}</h4>
					<h5>{upgrade.price}€</h5>
				</div>
				{upgrade.progress && (
					<div className="py-2 items-center">
						<div className="flex flex-row items-center justify-between text-center">
							<h4>{t(`research.progress.title`) as string}</h4>
							<p className="my-auto ml-2">
								{upgrade.progress}/{upgrade.price}
							</p>
						</div>
						<progress
							className="progress progress-primary w-full"
							value={upgrade.progress}
							max={upgrade.price}
						/>
					</div>
				)}
				{upgrade.price !== upgrade.progress && (
					<div className="py-2">
						<h4>Investícia</h4>
						<Slider
							min={0}
							max={upgrade.price - upgrade.progress}
							value={0}
							setValue={(val) => {
								setUpgrade(upgrade.name, val);
							}}
							checked={false}
							setChecked={(val) => {}}
						/>
					</div>
				)}
			</div>
			<div className="">
				<div className="flex flex-row justify-end">
					<X className="py-2 cursor-pointer" size={48} onClick={onClick} />
				</div>
				<div className="h-[75vh]">
					<Canvas cameraPosition={new Vector3(...upgrade.camera.position)} />
				</div>
			</div>
		</div>
	);
}

export default ProductModal;
