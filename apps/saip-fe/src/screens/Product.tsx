import React from "react";
import { useTranslation } from "react-i18next";

function Product() {
	const { t } = useTranslation();

	return (
		<div className="max-w-7xl">
			<div className="grid grid-cols-2 gap-6 p-6">
				<div className="flex flex-col background-container p-6 rounded-2xl">
					<h1>{t("product.title") as string}</h1>
					<div className="py-4">
						<h2>{t("product.description.title") as string}</h2>
						<p>{t("product.description.text") as string}</p>
					</div>

					<div className="py-4">
						<h2>{t("product.features.title") as string}</h2>
					</div>
				</div>
				<div className="flex flex-col">
					<img src="https://via.placeholder.com/1280" alt="placeholder" className=" rounded-2xl" />
				</div>
			</div>
		</div>
	);
}

export default Product;
