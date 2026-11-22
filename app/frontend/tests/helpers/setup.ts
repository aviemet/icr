import "@testing-library/jest-dom/vitest"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "@/lib/locales/en.json"

class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}

if(typeof globalThis.ResizeObserver === "undefined") {
	globalThis.ResizeObserver = ResizeObserverStub
}

if(!i18n.isInitialized) {
	// eslint-disable-next-line import/no-named-as-default-member
	void i18n.use(initReactI18next).init({
		lng: "en",
		fallbackLng: "en",
		resources: {
			en: {
				translation: en.en,
			},
		},
		interpolation: {
			escapeValue: false,
			prefix: "%{",
			suffix: "}",
		},
	})
}
