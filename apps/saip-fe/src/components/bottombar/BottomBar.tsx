import { useAtom } from "jotai";
import React, {useContext, useEffect, useState} from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { totalSpentPersist } from "../../store/Atoms";
import useCompanyStore from "../../store/Company";
import useMarketingStore from "../../store/Marketing";
import useUpgradesStore from "../../store/Upgrades";
import { GameState } from "../../types/gameState";
import useModal from "../modal/useModal";
import BottomBarModal from "./BottomBarModal";
import getGeneralInfo from "../../api/CompanyInfo";
import endTurn from "../../api/EndTurn";
// @ts-ignore
import  {MyContext}  from "..//../api/MyContext.js";

export default function BottomBar() {
	const dataWs = useContext(MyContext);
	const { isLoading, data } = useQuery("companyInfo", () => getGeneralInfo());
	// @ts-ignore
	const [committed, setCommitted] = useState(false)
	const [bonusCash, setBonusCash] = useState(0)
	// @ts-ignore
	useEffect(() => {
		// @ts-ignore
		console.log("data",dataWs.comm)
		console.log("comm", committed)
		// @ts-ignore
		if (dataWs.comm != committed){
			setCommitted(!committed)
		}


		// @ts-ignore
		console.log("data",dataWs.comm)
		console.log("comm", committed)

	}, [dataWs]);
	const { Modal, isShowing, setIsShowing, setElement } = useModal(<div />);

	const { reset: resetCompanyState } = useCompanyStore();
	const { reset: resetUpgradeState } = useUpgradesStore();
	const { reset: resetMarketingState } = useMarketingStore();

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
	const { getSum: getSumUpgrades, getChecked: getCheckedUpgrages, upgrades } = useUpgradesStore();

	const navigate = useNavigate();

	const [totalSpent, setTotalSpent] = useAtom(totalSpentPersist);
	// const [totalSpentBonus, setTotalSpentBonus] = useAtom(totalSpentPersistBonus);

	useEffect(() => {
		setTotalSpent(getSumUpgrades() + capitalInvestments + getSumMarketing());
		try {
			setBonusCash(data.bonus_spendable_cash)
		}
		catch (e) {
			console.log(e)
		}
	}, [getSumUpgrades(), capitalInvestments, getSumMarketing(), data]);

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
		resetUpgradeState();
		resetCompanyState();
		resetMarketingState();
	};

	const handleModalSubmit = async () => {
		setCommitted(!committed)
		setIsShowing(false);
		await handleEndTurn();
	};

	const openModal = () => {
		setElement(<BottomBarModal onAccept={handleModalSubmit} onDecline={() => setIsShowing(false)} />);
		setIsShowing(true);
	};

	// @ts-ignore
	return (
		<>
			{isShowing && <Modal />}
			<div className="fixed bottom-2 right-2 z-40">
				{!isLoading ? (
					<div className="bg-white px-3 py-1 rounded-lg border-2 accent-700-border">
						{committed ? (
							<p className="text-center font-medium p-3">Čaká sa na ostatných hráčov</p>
						) : (
							<div className="flex flex-row gap-8 items-center">
								<p
									className={`text-center font-medium ${
										totalSpent - capitalInvestments > data.budget_cap ||
										totalSpent > data.budget_cap + bonusCash ? "text-red-600" : ""
									}`}
								>
									Rozpočet: {totalSpent}/{data.budget_cap}€ + ({bonusCash}€)
								</p>
								<button type="button" onClick={() => navigate("/company")} className="button-clear">
									Výroba: {getCheckedCompany() ? "✅" : "❌"}
								</button>
								<button type="button" onClick={() => navigate("/product")} className="button-clear">
									R&D: {getCheckedUpgrages() ? "✅" : "❌"}
								</button>
								<button type="button" onClick={() => navigate("/marketing")} className="button-clear">
									Marketing: {getCheckedMarketing() ? "✅" : "❌"}
								</button>
								<button
									type="button"
									onClick={openModal}
									className="button-dark font-bold py-2 px-4 rounded-lg disabled:cursor-not-allowed"
									disabled={
										totalSpent - capitalInvestments > data.budget_cap ||
										totalSpent > data.budget_cap + bonusCash ||
										!getCheckedCompany() ||
										!getCheckedUpgrages() ||
										!getCheckedMarketing() || committed
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
