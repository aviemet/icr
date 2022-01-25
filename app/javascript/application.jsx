import { createInertiaApp } from '@inertiajs/inertia-react'
import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import { InertiaProgress } from '@inertiajs/progress'
import { AuthLayout, AppLayout } from './layouts'

document.addEventListener('DOMContentLoaded', () => {
	const csrfToken = document.querySelector('meta[name=csrf-token]').content
	axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

	InertiaProgress.init()

	createInertiaApp({
		title: title => `ICR - ${title}`,
		resolve: name => {
			const page = require(`./pages/${name}`).default
			if(page.layout === undefined) {
				page.layout = name.startsWith('Public/') ? AuthLayout : AppLayout
			}
			return page
		},
		setup({ el, App, props }) {
			render(<App { ...props } />, el)
		},
	})
})
