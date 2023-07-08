import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { AppLayout, AuthLayout } from '../Layouts'

import '@total-typescript/ts-reset'

type PagesObject = { default: React.ComponentType<any> & {
	layout?: React.ComponentType<any>
} }

const pages = import.meta.glob<PagesObject>('../Pages/**/index.tsx')

document.addEventListener('DOMContentLoaded', () => {
	const csrfToken = (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement).content
	axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

	createInertiaApp({
		title: title => `ICR SLS - ${title}`,

		resolve: async name => {
			let checkedName = name
			let layout

			switch(name.substring(0, name.indexOf('/'))) {
				case 'Auth':
					layout = AuthLayout
					checkedName = name.replace('Auth/', '')
					break
				default:
					layout = AppLayout
			}

			const page = (await pages[`../Pages/${checkedName}/index.tsx`]()).default

			if(page.layout === undefined) page.layout = layout

			return page
		},

		setup({ el, App, props }) {
			const root = createRoot(el)
			root.render(<App { ...props } />)
		},
	})
})
