import { App, createInertiaApp } from '@inertiajs/inertia-react'
import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import { InertiaProgress } from '@inertiajs/progress'
import { LoginLayout, AppLayout } from '../layouts'
import Providers from '../layouts/Providers'

document.addEventListener('DOMContentLoaded', () => {
	InertiaProgress.init()
	const el = document.getElementById('app')

	const csrfToken = document.querySelector('meta[name=csrf-token]').content
	axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

	createInertiaApp({
		resolve: name => {
			const page = require(`../pages/${name}`).default
			if(page.layout === undefined) {
				page.layout = name.startsWith('Public/') ? LoginLayout : AppLayout
			}
			return page
		},
		setup({ el, App, props }) {
			render(
				<Providers><App { ...props } /></Providers>,
				el
			)
		},
	})
})
