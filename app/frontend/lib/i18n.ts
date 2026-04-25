import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

const defaultLocale = "en"

const localeContext = import.meta.glob<Record<string, Record<string, object>>>("./locales/*.json", { eager: true })

const resources = Object.entries(localeContext).reduce((acc, [path, translation]) => {
	const locale = path.match(/\.\/locales\/(.+)\.json/)?.[1] || defaultLocale
	return {
		...acc,
		[locale]: {
			translation: translation[locale] as object,
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
		debug: true,
		interpolation: {
			escapeValue: false, // React already escapes values
			prefix: "%{",
			suffix: "}",
		},
	})

export { i18n }
