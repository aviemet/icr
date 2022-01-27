import { createInertiaApp } from '@inertiajs/inertia-react'
import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import { InertiaProgress } from '@inertiajs/progress'
import { AuthLayout, AppLayout } from '../layouts'
import dynamicImport from '../dynamicImport'

document.addEventListener('DOMContentLoaded', () => {
	const csrfToken = document.querySelector('meta[name=csrf-token]').content
	axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

	InertiaProgress.init()

	createInertiaApp({
		title: title => `ICR - ${title}`,
		resolve: async name => {
			const page = await dynamicImport(name)

			if(page.layout === undefined) {
				page.layout = name.startsWith('Public/') ? AuthLayout : AppLayout
			}
			return page
		},
		setup({ el, App, props }) {
			console.log({ props })
			render(<App { ...props } />, el)
		},
	})
})
