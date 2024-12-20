import React from 'react'
import Providers from '@/Layouts/Providers'
import { Flash } from '@/Components'

export { default as AppLayout } from './AppLayout'
export { default as AuthLayout } from './AuthLayout'
export { default as PublicLayout } from './PublicLayout'

interface LayoutWrapperProps {
	children: any
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
	return (
		<Providers>
			<Flash />
			{ children }
		</Providers>
	)
}
