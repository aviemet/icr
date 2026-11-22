import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

const defaultLocale = "en"

const localeContext = import.meta.glob<Record<string, Record<string, object>>>("./locales/*.json", { eager: true })

const resources = Object.entries(localeContext).reduce<Record<string, { translation: object }>>((acc, [path, translation]) => {
	const locale = path.match(/\.\/locales\/(.+)\.json/)?.[1] || defaultLocale
	const localeTranslation = translation[locale]
	if(!localeTranslation) return acc

	return {
		...acc,
		[locale]: {
			translation: localeTranslation,
		},
	}
}, {})

// eslint-disable-next-line import/no-named-as-default-member
i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: defaultLocale,
		debug: import.meta.env.MODE === "development",
		interpolation: {
			escapeValue: false, // React already escapes values
			prefix: "%{",
			suffix: "}",
		},
	})

export { i18n }
