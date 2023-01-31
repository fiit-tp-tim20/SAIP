import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getUpgrades as mockGetUpgrades } from "../mock/product";
import UpgradeInfo from "../components/product/UpgradeInfo";
import Canvas from "../components/three/Canvas";
import { useModal } from "../components/modal/useModal";
import { Upgrade } from "../types/product";
import ProductModal from "../components/product/ProductModal";
import { getUpgrades } from "../api/Upgrades";

function Product() {
	const { t } = useTranslation();

	const { Modal, setIsShowing, setElement } = useModal(<></>);

	const { isLoading, data } = useQuery(["upgrades"], getUpgrades);

	useEffect(() => {
		console.warn("data", data);
		console.warn("isLoading", isLoading);
	}, [data, isLoading]);

	const openModal = (feature: Upgrade) => {
		setElement(
			<ProductModal
				upgrade={feature}
				onClick={() => {
					setIsShowing(false);
				}}
			/>,
		);
		setIsShowing(true);
	};

	return (
		<>
			<Modal />
			<div className="max-w-7xl flex flex-col justify-center">
				<h1 className="p-6 pl-12">{t("product.title") as string}</h1>
				<div className="grid grid-cols-2 gap-6 px-6 max-w-7xl">
					<div className="flex flex-col background-container p-6 rounded-2xl">
						<div className="py-4">
							<h2>{t("product.name.title") as string}</h2>
							<p className="pt-1">{t("product.name.ebike") as string}</p>
						</div>
						<div className="py-4">
							<h2>{t("product.description.title") as string}</h2>
							<p className="pt-1">{t("product.description.text") as string}</p>
						</div>
						<div className="py-4">
							<h2>{t("research.finished.title") as string}</h2>
							{isLoading ? (
								<p>Loading...</p>
							) : (
								<ul className="pt-1">
									{data &&
										data
											.filter((feature) => feature.status === "finished")
											.map((feature) => (
												<UpgradeInfo
													key={feature.id}
													name={feature.name}
													// name={t(`research.features.${feature.id}.title`) as string}
													researchedAvatars={feature.players}
													onClick={() => openModal(feature)}
												/>
											))}
								</ul>
							)}
						</div>
					</div>
					{/* <div className="max-h-[50vh]"> */}
					<div className="h-auto">
						<Canvas />
					</div>
				</div>
				<h1 className="p-6 pl-12">{t("research.title") as string}</h1>
				<div className="flex flex-col background-container p-6 rounded-2xl mx-6 max-w-7xl">
					<div className="py-4">
						<h2>{t("research.pending.title") as string}</h2>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<ul className="pt-1">
								{data &&
									data
										.filter((feature) => feature.status === "started")
										.map((feature) => (
											<UpgradeInfo
												key={feature.id}
												name={feature.name}
												// name={t(`research.features.${feature.id}.title`) as string}
												researchedAvatars={feature.players}
												progressMax={feature.price}
												progressValue={feature.progress}
												onClick={() => openModal(feature)}
											/>
										))}
							</ul>
						)}
					</div>
					<div className="py-4">
						<h2>{t("research.available.title") as string}</h2>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<ul className="pt-1">
								{data &&
									data
										.filter((feature) => feature.status === "not started")
										.map((feature) => (
											<UpgradeInfo
												key={feature.id}
												name={feature.name}
												// name={t(`research.features.${feature.id}.title`) as string}
												researchedAvatars={feature.players}
												onClick={() => openModal(feature)}
											/>
										))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default Product;
