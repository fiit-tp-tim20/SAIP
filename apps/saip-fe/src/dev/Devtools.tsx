import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import usePreferredMode from "../hooks/usePreferredMode";

function Devtools() {
	const languages = [
		{ code: "sk", name: "Slovenčina" },
		{ code: "en", name: "English" },
	];

	const { i18n } = useTranslation();

	const [language, setLanguage] = useState(i18n.language);

	if (!language) {
		return null;
	}

	return (
		<div className="fixed bottom-5 right-5 dropdown dropdown-top dropdown-end">
			<label tabIndex={0} className="btn btn-primary m-1">
				Click
			</label>
			<div
				tabIndex={0}
				className="dropdown-content menu p-5 shadow background-container rounded-box w-max w-auto"
			>
				<h2 className="text-left font-bold">Devtools</h2>
				<div className="flex flex-row">
					<div className="flex flex-col mx-3">
						<h3 className="text-left">Language</h3>
						<select
							className="select w-full max-w-xs"
							title="Language"
							value={language}
							onChange={(e) => {
								setLanguage(e.target.value);
								i18n.changeLanguage(e.target.value);
							}}
						>
							{languages.map((_language) => (
								<option key={_language.code} value={_language.code}>
									{_language.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Devtools;
