import Providers from '@/Layouts/Providers'
import { Flash } from '@/Components'

import BareAppLayout from './AppLayout'
import BareAuthLayout from './AuthLayout'
import BarePublicLayout from './PublicLayout'

export const LAYOUTS = {
	'app': 'app',
	'auth': 'auth',
	'public': 'public',
} as const

export interface LayoutProps {
	children: any
}

export const LayoutWrapper = ({ children }: LayoutProps) => {
	return (
		<Providers>
			<Flash />
			{ children }
		</Providers>
	)
}

export const AppLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<BareAppLayout>
				{ children }
			</BareAppLayout>
		</LayoutWrapper>
	)
}

export const AuthLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<BareAuthLayout>
				{ children }
			</BareAuthLayout>
		</LayoutWrapper>
	)
}


export const PublicLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<BarePublicLayout>
				{ children }
			</BarePublicLayout>
		</LayoutWrapper>
	)
}

