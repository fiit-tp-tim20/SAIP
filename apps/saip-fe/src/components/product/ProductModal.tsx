import React from "react";
import { X } from "react-feather";
import { useTranslation } from "react-i18next";
import { Vector3 } from "three";
import { Upgrade } from "../../types/product";
import Canvas from "../three/Canvas";

type Props = {
	upgrade: Upgrade;
	onClick?: () => void;
};

function ProductModal(props: Props) {
	const { upgrade, onClick } = props;
	const { t } = useTranslation();

	console.log(upgrade);

	return (
		<div className="background-container rounded-2xl p-6 grid grid-cols-2 gap-6 max-w-5xl min-h-[50vh] max-h-[95vh]">
			<div className="flex flex-col max-h-[90vh] overflow-scroll scrollbar-hide">
				<div className="py-2">
					<h2 className="pb-2">{t(`research.features.${upgrade.id}.title`) as string}</h2>
					<p>{t(`research.features.${upgrade.id}.text`) as string}</p>
				</div>
				<div className="py-2">
					<h4>{t(`research.playerResearched.title`) as string}</h4>
					{upgrade.players.map((player) => (
						<div
							key={player.id}
							className="flex items-center p-3 my-1 rounded-2xl bg-gray-200 dark:bg-[#242424]"
						>
							<div className="avatar pr-4">
								<div className="w-8 rounded-full ring ring-accent-400 ring-offset-base-100 ring-offset-2">
									<img
										src={`https://avatars.dicebear.com/api/miniavs/${player.image}.png`}
										alt={player.name}
										className="w-8 h-8 rounded-full mr-2 bg-gray-200"
									/>
								</div>
							</div>
							<p>{player.name}</p>
						</div>
					))}
				</div>
				<div className="py-2 flex flex-row items-center justify-between">
					<h4>{t(`research.price.title`) as string}</h4>
					<h5>{upgrade.price}€</h5>
				</div>
				{upgrade.progress && (
					<div className="py-2 items-center">
						<h4>{t(`research.progress.title`) as string}</h4>
						<div className="flex flex-row items-center justify-between text-center">
							<progress
								className="progress progress-primary w-96"
								value={upgrade.progress}
								max={upgrade.price}
							/>
							<p className="my-auto ml-2">
								{upgrade.progress}/{upgrade.price}
							</p>
						</div>
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
