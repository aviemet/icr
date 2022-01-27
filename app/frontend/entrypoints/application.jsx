import { createInertiaApp } from '@inertiajs/inertia-react'
import React from 'react'
import { render } from 'react-dom'
// import axios from 'axios'
import { InertiaProgress } from '@inertiajs/progress'
import { AuthLayout, AppLayout } from '../layouts'
import dynamicImport from '../dynamicImport'

document.addEventListener('DOMContentLoaded', () => {
	// const csrfToken = document.querySelector('meta[name=csrf-token]').content
	// axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

	InertiaProgress.init()

	createInertiaApp({
		title: title => `ICR - ${title}`,
		resolve: async name => {
			// let page
			// const path = name.split('/')
			// console.log({ depth: path.length })
			// // Explicit import paths for rollup dyanimc import plugin
			// // This limits directory nesting for page entry points to 3 levels
			// switch (path.length) {
			// 	case 1:
			// 		page = (await import(`../pages/${name}.tsx`)).default
			// 		break
			// 	case 2:
			// 		page = (await import(`../pages/${path[0]}/${path[1]}.tsx`)).default
			// 		break
			// 	case 3:
			// 		page = (await import(`../pages/${path[0]}/${path[1]}/${path[2]}.tsx`)).default
			// 		break
			// 	default:
			// 		console.error(`Provided path ${path} is not supported. Must be between 1 and 3 levels deep only`)
			// }

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