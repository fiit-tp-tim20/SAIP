import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import UpgradeInfo from "../components/product/UpgradeInfo";
import Canvas from "../components/three/Canvas";
import useModal from "../components/modal/useModal";
import { Upgrade } from "../types/product";
import ProductModal from "../components/product/ProductModal";
import getUpgrades from "../api/Upgrades";
import useUpgradesStore from "../store/Upgrades";
import Tutorial from "../components/modal/Tutorial";

function Product() {
	const { t } = useTranslation();

	const { Modal, isShowing, setIsShowing, setElement } = useModal(<div />);

	const { isLoading, data } = useQuery(["upgrades"], getUpgrades);

	const { upgrades, setUpgrade, setUpgradeCheck, upgradesCheck } = useUpgradesStore();

	// State for managing tutorial visibility
	const [isTutorialOpen, setTutorialOpen] = useState<boolean>(true);

	// State for managing tutorial visibility
	const [tutorialStates, setTutorialStates] = useState({
		upgrades_tutorial: false,
	});

	const openTutorial = (tutorialKey: string) => {
		setTutorialStates((prevStates) => ({
			...prevStates,
			[tutorialKey]: true,
		}));
	};

	const closeTutorial = (tutorialKey: string) => {
		setTutorialStates((prevStates) => ({
			...prevStates,
			[tutorialKey]: false,
		}));
	};

	useEffect(() => {
		if (!data) return;
		data.forEach((upgrade) => {
			if (upgrades[upgrade.name] || upgradesCheck[upgrade.name]) return;
			setUpgrade(upgrade.name, 0);
			setUpgradeCheck(upgrade.name, false);
		});
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
			{isShowing && <Modal />}
			<div className="max-w-7xl flex flex-col justify-center">
				<h1 className="p-6 pl-12">{t("product.title") as string}</h1>
				<div className="grid grid-cols-2 gap-6 px-6 max-w-7xl">
					<div className="flex flex-col background-container p-6 rounded-2xl">
						<div className="py-4">
							<h1>{t("product.name.ebike") as string}</h1>
						</div>
						<div className="py-4 text-justify">
							<h4>{t("product.description.title") as string}</h4>
							<p className="pt-1">
								Elektrický bicykel je výkonným a praktickým komerčným produktom, ktorý ponúka široké
								spektrum výhod pre rôzne typy používateľov. Jeho elektrický pohon umožňuje jednoduchšie
								a rýchlejšie presuny po meste, čím zvyšuje produktivitu a znižuje náklady na dopravu.
								Navyše, elektrický bicykel je ekologickejší ako benzínové vozidlá, čo znamená, že pomáha
								znižovať emisie škodlivých látok a prispieva k lepšej kvalite ovzdušia. Jeho kompaktnosť
								a schopnosť prekonať kopce aj v rušnom mestskom prostredí ho robia vhodným pre dodávky a
								rýchle presuny.
							</p>
						</div>
						{data && data.filter((feature) => feature.status === "finished").length ? (
							<div className="py-4">
								<h2>{t("research.finished.title") as string}</h2>
								{isLoading ? (
									<p>Loading...</p>
								) : (
									<ul className="pt-1">
										{data &&
											data
												.filter((feature) => feature.status === "finished")
												.map((feature, index) => (
													<UpgradeInfo
														key={index}
														name={feature.name}
														// name={t(`research.features.${feature.id}.title`) as string}
														researchedAvatars={feature.players}
														onClick={() => openModal(feature)}
													/>
												))}
									</ul>
								)}
							</div>
						) : null}
					</div>
					{/* <div className="max-h-[50vh]"> */}
					<div className="h-auto">
						<Canvas />
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<h1 className="p-6 pl-12">{t("research.title") as string}</h1>
						<button
							onClick={() => openTutorial("upgrades_tutorial")}
							className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
						>
							💡
						</button>
						{tutorialStates.upgrades_tutorial && (
							<Tutorial
								isOpen={tutorialStates.upgrades_tutorial}
								closeModal={() => closeTutorial("upgrades_tutorial")}
								textTitle="Tip"
								textContent={
									<div>
										Efekt vylepšení vstupuje do platnosti až kolo po tom, čo bolo vylepšenie
										dokončené
									</div>
								}
							/>
						)}
					</div>
					<button
						onClick={() => {
							data.forEach((upgrade) => {
								setUpgrade(upgrade.name, 0);
								setUpgradeCheck(upgrade.name, true);
							});
						}}
						className="button-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
					>
						Nevyvíjať
					</button>
				</div>
				<div className="flex flex-col background-container p-6 rounded-2xl mx-6 max-w-7xl">
					{data && data.filter((feature) => feature.status === "started").length ? (
						<div className="py-4">
							<h2>{t("research.pending.title") as string}</h2>

							{isLoading ? (
								<p>Loading...</p>
							) : (
								<ul className="pt-1">
									{data &&
										data
											.filter((feature) => feature.status === "started")
											.map((feature, index) => (
												<UpgradeInfo
													key={index}
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
					) : null}
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
												// @ts-ignore
												key={feature.id}
												name={feature.name}
												progressMax={feature.price}
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
