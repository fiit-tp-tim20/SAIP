import React from "react";
import {useTranslation} from "react-i18next";

type Props = {
	onAccept: () => void;
	onDecline: () => void;
};

function BottomBarModal(props: Props) {
	const { t } = useTranslation();
	const { onAccept, onDecline } = props;

	return (
		<div className="background-container rounded-2xl p-6 flex flex-col gap-4">
			<h5>{t("bottombar_modal.check") as string}</h5>
			<div className="flex flex-row gap-4 justify-end">
				<button
					type="button"
					onClick={onDecline}
					className="button-light font-bold py-2 px-4 rounded-lg disabled:bg-accent-100 disabled:cursor-not-allowed"
				>
					{t("buttons.cancel") as string}
				</button>
				<button
					type="submit"
					onClick={onAccept}
					className="button-dark font-bold py-2 px-4 rounded-lg disabled:bg-accent-100 disabled:cursor-not-allowed"
				>
					{t("buttons.confirm") as string}
				</button>
			</div>
		</div>
	);
}

export default BottomBarModal;
