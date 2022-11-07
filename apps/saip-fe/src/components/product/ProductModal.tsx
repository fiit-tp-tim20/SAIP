import React from "react";
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
		<div className="background-container rounded-2xl py-6 px-3 max-w-7xl" onClick={onClick}>
			<div className="flex flex-row">
				<div className="flex flex-col px-3">
					<h3>{t(`research.features.${upgrade.id}.title`) as string}</h3>
					<p>{t(`research.features.${upgrade.id}.text`) as string}</p>
					<h4>{t(`research.playerResearched.title`) as string}</h4>
				</div>
				<div className="h-auto px-3">
					<Canvas cameraPosition={new Vector3(...upgrade.camera.position)} />
				</div>
			</div>
		</div>
	);
}

export default ProductModal;
