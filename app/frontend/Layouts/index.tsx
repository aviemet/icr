import React from 'react'
import type { PageProps } from '@inertiajs/inertia'
import Providers from '@/Providers'

import AppLayout from './AppLayout'
import AuthLayout from './AuthLayout'

interface LayoutWrapperProps {
	children: React.ReactNode
	auth: {
		user: Record<string, string>
		form_authenticity_token: string
	}
}

interface InertiaPageProps extends PageProps {
	props: LayoutWrapperProps
}

const LayoutWrapper = React.memo(({ children, auth }: LayoutWrapperProps) => {
	return(
		<Providers auth={ auth }>
			{ children }
		</Providers>
	)
})

const AppLayoutLayout = (page: InertiaPageProps) => {
	return(
		<LayoutWrapper auth={ page.props.auth }>
			<AppLayout>{ page }</AppLayout>
		</LayoutWrapper>
	)
}

const AuthLayoutLayout = (page: InertiaPageProps) => {
	return(
		<LayoutWrapper auth={ page.props.auth }>
			<AuthLayout>{ page }</AuthLayout>
		</LayoutWrapper>
	)
}


export {
	AppLayoutLayout as AppLayout,
	AuthLayoutLayout as AuthLayout
}
