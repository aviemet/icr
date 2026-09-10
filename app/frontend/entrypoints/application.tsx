import { createInertiaApp, router } from "@inertiajs/react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import { createRoot } from "react-dom/client"

import {
	applyPropsMiddleware,
	setupCSRFToken,
	setupInertiaListeners,
	handlePageLayout,
} from "./middleware"

dayjs.extend(localizedFormat)
dayjs.extend(localizedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)

const SITE_TITLE = "Super SLS"

export type PagesObject<T = object> = { default: React.ComponentType<T> & {
	layout?: (children: React.ReactNode) => React.JSX.Element
	defaultLayout?: keyof typeof import("../layouts").LAYOUTS
} }

const pages = import.meta.glob<PagesObject>("../pages/**/index.tsx")

setupCSRFToken()
setupInertiaListeners(router)

createInertiaApp({
	title: title => `${SITE_TITLE} - ${title}`,

	resolve: async (name) => {
		const pageImporter = pages[`../pages/${name}/index.tsx`]

		const module = await pageImporter()
		return handlePageLayout(module)
	},

	setup({ el, App, props }) {
		if(!el) return
		props.initialPage.props = applyPropsMiddleware(props.initialPage.props)
		createRoot(el).render(<App { ...props } />)
	},
})
