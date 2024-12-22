import React from 'react'
import { createInertiaApp, router } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { PublicLayout, AppLayout, AuthLayout, LAYOUTS, LayoutProps } from '../Layouts'
import { propsMiddleware } from './middleware'
import { runAxe } from './middleware/axe'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

const pages = import.meta.glob<PagesObject>('../Pages/**/index.tsx')

dayjs.extend(localizedFormat)
dayjs.extend(localizedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)

const SITE_TITLE = 'Super SLS'

type PagesObject = { default: React.ComponentType<any> & {
	layout?: React.ComponentType<any>
	defaultLayout?: keyof typeof LAYOUTS
} }

const LAYOUT_COMPONENTS: Record<keyof typeof LAYOUTS, ({ children }: LayoutProps) => React.JSX.Element> = {
	'app': AppLayout,
	'auth': AuthLayout,
	'public': PublicLayout,
} as const

document.addEventListener('DOMContentLoaded', () => {
	const csrfToken = (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement).content
	axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

	router.on('navigate', (event) => {
		event.detail.page.props = propsMiddleware(event.detail.page.props)
	})

	createInertiaApp({
		title: title => `${SITE_TITLE} - ${title}`,

		resolve: async (name) => {
			const page = (await pages[`../Pages/${name}/index.tsx`]()).default

			const DefaultLayout = LAYOUT_COMPONENTS[page.defaultLayout as keyof typeof LAYOUTS] || AppLayout

			page.layout ||= (children: React.ReactNode) => <DefaultLayout>{ children }</DefaultLayout>

			return page
		},

		setup({ el, App, props }) {
			const root = createRoot(el)

			props.initialPage.props = propsMiddleware(props.initialPage.props)

			router.on('success', event => {
				runAxe(root)
			})

			runAxe(root)
			root.render(<App { ...props } />)
		},
	})
})
