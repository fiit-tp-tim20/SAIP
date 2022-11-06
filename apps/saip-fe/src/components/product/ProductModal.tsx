import React from "react";
import { Upgrade } from "../../types/product";

type Props = {
	upgrade: Upgrade;
	onClick?: () => void;
};

function ProductModal(props: Props) {
	const { upgrade, onClick } = props;

	return (
		<div className="background-container" onClick={onClick}>
			ProductModal
		</div>
	);
}

export default ProductModal;
