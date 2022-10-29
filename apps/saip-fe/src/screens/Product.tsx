import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getAvailableUpgrades, getPendingUpgrades, getResearchedUpgrades } from "../mock/product";
import UpgradeInfo from "../components/product/UpgradeInfo";
import Test from "../components/three/Test";

function Product() {
	const { t } = useTranslation();

	const { isLoading: isLoadingResearched, data: dataResearched } = useQuery(["researchedUpgrades"], () =>
		getResearchedUpgrades(),
	);

	const { isLoading: isLoadingPending, data: dataPending } = useQuery(["pendingUpgrades"], () =>
		getPendingUpgrades(),
	);

	const { isLoading: isLoadingAvailable, data: dataAvailable } = useQuery(["availableUpgrades"], () =>
		getAvailableUpgrades(),
	);

	return (
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
						{isLoadingResearched ? (
							<p>Loading...</p>
						) : (
							<ul className="pt-1">
								{dataResearched &&
									dataResearched.map((feature) => (
										<UpgradeInfo
											key={feature.id}
											name={t(`research.features.${feature.id}.title`) as string}
											researchedAvatars={feature.players.map((player) => player.image)}
										/>
									))}
							</ul>
						)}
					</div>
				</div>
				<div>
					<Test />
					{/* <Canvas
						// flat
						// linear
						dpr={[1, 2]}
						camera={{ fov: 25, position: [0, 0, 8], aspect: 10000 }}
					>
						<PresentationControls
							global
							zoom={0.8}
							rotation={[0, -Math.PI / 4, 0]}
							polar={[0, Math.PI / 4]}
							azimuth={[-Math.PI / 4, Math.PI / 4]}
						>
							{/* <color attach="background" args={["#F3F4F6"]} /> 
							<color attach="background" args={["#00ffff"]} />
							<ambientLight />
							<Bike position={[0, 0, 0]} />
						</PresentationControls>
					</Canvas> */}
					{/* <img src="https://via.placeholder.com/1280" alt="placeholder" className=" rounded-2xl" /> */}
				</div>
			</div>
			<h1 className="p-6 pl-12">{t("research.title") as string}</h1>
			<div className="flex flex-col background-container p-6 rounded-2xl mx-6 max-w-7xl">
				<div className="py-4">
					<h2>{t("research.pending.title") as string}</h2>
					{isLoadingPending ? (
						<p>Loading...</p>
					) : (
						<ul className="pt-1">
							{dataPending &&
								dataPending.map((feature) => (
									<UpgradeInfo
										key={feature.id}
										name={t(`research.features.${feature.id}.title`) as string}
										researchedAvatars={feature.players.map((player) => player.image)}
										progressMax={feature.progressMax}
										progressValue={feature.progressValue}
									/>
								))}
						</ul>
					)}
				</div>
				<div className="py-4">
					<h2>{t("research.available.title") as string}</h2>
					{isLoadingAvailable ? (
						<p>Loading...</p>
					) : (
						<ul className="pt-1">
							{dataAvailable &&
								dataAvailable.map((feature) => (
									<UpgradeInfo
										key={feature.id}
										name={t(`research.features.${feature.id}.title`) as string}
										researchedAvatars={feature.players.map((player) => player.image)}
									/>
								))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}

export default Product;
