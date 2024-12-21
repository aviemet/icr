import React from 'react'
import { createInertiaApp, router } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { PublicLayout, AppLayout, AuthLayout, LayoutWrapper } from '../Layouts'
import { propsMiddleware } from './middleware'
import { runAxe } from './middleware/axe'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(localizedFormat)
dayjs.extend(localizedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)

const SITE_TITLE = 'Super SLS'

type PagesObject = { default: React.ComponentType<any> & {
	layout?: React.ComponentType<any>
} }

// Map of layout names to components
// This needs to manually be kept in sync with the definitions on the server
// app/controllers/concerns/inertia_share/layout.rb
const LAYOUT_COMPONENTS = {
	'app': AppLayout,
	'auth': AuthLayout,
	'public': PublicLayout,
} as const

const pages = import.meta.glob<PagesObject>('../Pages/**/index.tsx')
console.log({ pages })
document.addEventListener('DOMContentLoaded', () => {
	const csrfToken = (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement).content
	axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

	router.on('navigate', (event) => {
		event.detail.page.props = propsMiddleware(event.detail.page.props)
	})

	createInertiaApp({
		title: title => `${SITE_TITLE} - ${title}`,

		resolve: async name => {
			console.log({ name, page: pages[`../Pages/${name}/index.tsx`] })
			const page = (await pages[`../Pages/${name}/index.tsx`]()).default

			page.layout = (page) => {
				const props = page.props
				let Layout = LAYOUT_COMPONENTS[props.layout as keyof typeof LAYOUT_COMPONENTS] || LAYOUT_COMPONENTS['app']

				return (
					<LayoutWrapper>
						<Layout>
							{ page }
						</Layout>
					</LayoutWrapper>
				)
			}

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
