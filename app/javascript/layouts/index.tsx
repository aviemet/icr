import React from 'react'
import type { PageProps } from '@inertiajs/inertia'
import axios from 'axios'
import Providers from 'Providers'
import { AuthContextProvider } from 'Store'

import AppLayout from './AppLayout'
import AuthLayout from './AuthLayout'

const setCsrfTokenHeader = token => {
	axios.defaults.headers.common['X-CSRF-Token'] = token
}

interface InertiaPageProps extends PageProps {
	props: {
		auth: {
			user: Record<string, string>
			form_authenticity_token: string
		}
	}
}

const AppLayoutLayout = (page: InertiaPageProps) => {
	if(page.props.auth.form_authenticity_token) setCsrfTokenHeader(page.props.auth.form_authenticity_token)

	console.log({ props: page.props })

	return(
		<AuthContextProvider auth={ page.props.auth }>
			<Providers>
				<AppLayout>{ page }</AppLayout>
			</Providers>
		</AuthContextProvider>
	)
}

const AuthLayoutLayout = (page: InertiaPageProps) => {
	if(page.props.auth.form_authenticity_token) setCsrfTokenHeader(page.props.auth.form_authenticity_token)

	console.log({ props: page.props })

	return(
		<AuthContextProvider auth={ page.props.auth }>
			<Providers>
				<AuthLayout>{ page }</AuthLayout>
			</Providers>
		</AuthContextProvider>
	)
}

export {
	AppLayoutLayout as AppLayout,
	AuthLayoutLayout as AuthLayout
}
