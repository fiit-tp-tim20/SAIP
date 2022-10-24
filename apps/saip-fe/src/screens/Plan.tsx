import React from "react";
import { useTranslation } from "react-i18next";

function Plan() {
	const { t } = useTranslation();

	return (
		<div>
			<h1>{t("plan.title") as string}</h1>
		</div>
	);
}

export default Plan;
