import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { totalSpentPersist } from "../../store/Atoms";
import useCompanyStore from "../../store/Company";
import useMarketingStore from "../../store/Marketing";
import useUpgradesStore from "../../store/Upgrades";
import { GameState } from "../../types/gameState";
import useModal from "../modal/useModal";
import BottomBarModal from "./BottomBarModal";
import { getCommitted } from "../../api/GetCommitted";
import getGeneralInfo from "../../api/CompanyInfo";
import endTurn from "../../api/EndTurn";

export default function BottomBar() {
	const { isLoading, data } = useQuery("companyInfo", () => getGeneralInfo());
	const { data: committed, refetch: refetchCommited } = useQuery("committed", () => getCommitted());

	const { Modal, isShowing, setIsShowing, setElement } = useModal(<div />);

	const {
		getSum: getSumMarketing,
		getChecked: getCheckedMarketing,
		viral,
		ooh,
		billboard,
		tv,
		podcast,
	} = useMarketingStore();
	const { capitalInvestments, getChecked: getCheckedCompany, productCount, productPrice } = useCompanyStore();
	const { getSum: getSumUpgrades, upgrades } = useUpgradesStore();

	const navigate = useNavigate();

	const [totalSpent, setTotalSpent] = useAtom(totalSpentPersist);

	useEffect(() => {
		setTotalSpent(getSumUpgrades() + capitalInvestments + getSumMarketing());
	}, [getSumUpgrades(), capitalInvestments, getSumMarketing()]);

	const handleEndTurn = async () => {
		const gameState: GameState = {
			upgrades,
			company: {
				productPrice,
				productCount,
				capitalInvestments,
			},
			marketing: {
				viral,
				ooh,
				billboard,
				tv,
				podcast,
			},
		};

		await endTurn(gameState);
	};

	const handleModalSubmit = async () => {
		await handleEndTurn();
		setIsShowing(false);
		refetchCommited();
	};

	const openModal = () => {
		setElement(<BottomBarModal onAccept={handleModalSubmit} onDecline={() => setIsShowing(false)} />);
		setIsShowing(true);
	};

	return (
		<>
			{isShowing && <Modal />}
			<div className="fixed bottom-2 right-2 z-40">
				{!isLoading ? (
					<div className="bg-white px-3 py-1 rounded-lg border-2 border-accent-700">
						{committed ? (
							<p className="text-center font-medium p-3">Čaká sa na ostatných hráčov</p>
						) : (
							<div className="flex flex-row gap-8 items-center">
								<p
									className={`text-center font-medium ${
										totalSpent > data.budget_cap ? "text-red-600" : ""
									}`}
								>
									Budget: {totalSpent}/{data.budget_cap}€
								</p>
								<button type="button" onClick={() => navigate("/product")} className="button-clear">
									{/* TODO create state */}
									Produkt: ✅
								</button>
								<button type="button" onClick={() => navigate("/company")} className="button-clear">
									Spoločnosť: {getCheckedCompany() ? "✅" : "❌"}
								</button>
								<button type="button" onClick={() => navigate("/marketing")} className="button-clear">
									Marketing: {getCheckedMarketing() ? "✅" : "❌"}
								</button>
								<button
									type="button"
									onClick={openModal}
									className="bg-accent-500 hover:bg-accent-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-accent-100 disabled:cursor-not-allowed"
									disabled={
										totalSpent > data.budget_cap ||
										!getCheckedCompany() ||
										!getCheckedMarketing() ||
										committed
									}
								>
									Ukončiť kolo
								</button>
							</div>
						)}
					</div>
				) : null}
			</div>
		</>
	);
}
