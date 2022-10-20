import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationSK from "./locales/sk/translation.json";

const fallbackLng = ["sk"];

const resources = {
	en: {
		translation: translationEN,
	},
	sk: {
		translation: translationSK,
	},
};

i18n.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng,
		resources,
		// ns: ["locales"],
		// whitelist: availableLanguages,
		// detection: {
		// 	checkWhitelist: true,
		// },
		debug: false,
		interpolation: {
			escapeValue: false, // no need for react. it escapes by default
		},
	});

export default i18n;
