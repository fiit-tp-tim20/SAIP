import React from "react";
import { X } from "react-feather";
import { useTranslation } from "react-i18next";
import { Vector3 } from "three";
import useUpgradesStore from "../../store/Upgrades";
import { Upgrade } from "../../types/product";
import Slider from "../slider/Slider";
import Canvas from "../three/Canvas";
import numberWithSpaces from "../../utils/numberWithSpaces";

type Props = {
	upgrade: Upgrade;
	onClick?: () => void;
};

function ProductModal(props: Props) {
	const { upgrade, onClick } = props;
	const { t } = useTranslation();
	const { upgrades, upgradesCheck, setUpgrade, setUpgradeCheck } = useUpgradesStore();

	return (
		<div className="background-container rounded-2xl p-6 grid grid-cols-2 gap-6 w-[60vw] min-h-[50vh] max-h-[95vh]">
			<div className="flex flex-col max-h-[90vh] overflow-scroll scrollbar-hide">
				<div className="py-2">
					<h2 className="pb-2">{t(`features_translation.${upgrade.name}`)}</h2>
					<p className="text-justify">{upgrade.description}</p>
				</div>
				<div className="py-2">
					<h4>{t(`research.playerResearched.title`) as string}</h4>
					{upgrade.players.length === 0 && <p>Žiaden z hráčov zatiaľ nedokončil toto vylepšenie</p>}
					{upgrade.players.map((player) => (
						<div key={player} className="flex items-center p-3 my-1 rounded-2xl bg-green-300">
							<div className="avatar pr-4">
								<div className="w-8 rounded-full ring ring-accent-400 ring-offset-base-100 ring-offset-2">
									<img
										src={`https://ui-avatars.com/api/?name=${player}`}
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
					<h5>{numberWithSpaces(upgrade.price)}€</h5>
				</div>
				{upgrade.price >= upgrade.progress && (
					<div className="py-2 items-center">
						<div className="flex flex-row items-center justify-between text-center">
							<h4>{t(`research.progress.title`) as string}</h4>
							<p className="my-auto ml-2">
								{numberWithSpaces(upgrade.progress)} / {numberWithSpaces(upgrade.price)}€
							</p>
						</div>
						<div className="relative pt-1">
							<div className="overflow-hidden h-4 mb-4 text-xs flex rounded-2xl bg-neutral-300">
								<div
									style={{ width: `${(upgrade.progress / upgrade.price) * 100}%` }}
									className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center accent-700-bg ${
										!upgrades[upgrade.name] ? "rounded-r-2xl" : ""
									}`}
								/>
								<div
									style={{ width: `${(upgrades[upgrade.name] / upgrade.price) * 100}%` }}
									className="shadow-none rounded-r-2xl flex flex-col text-center whitespace-nowrap text-white justify-center bg-success-300"
								/>
							</div>
						</div>
					</div>
				)}
				{upgrade.price >= upgrade.progress && (
					<div className="py-2">
						<h4>Investícia</h4>
						<Slider
							min={0}
							max={upgrade.price - upgrade.progress > 10000 ? 10000 : upgrade.price - upgrade.progress}
							value={upgrades[upgrade.name]}
							setValue={(val) => {
								setUpgrade(upgrade.name, val);
							}}
							checked={upgradesCheck[upgrade.name]}
							setChecked={(val) => setUpgradeCheck(upgrade.name, val)}
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
