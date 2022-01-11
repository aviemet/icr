import React from 'react'
import { VechaiProvider } from '@vechaiui/react'
import theme from '../theme'

interface ProvidersProps {
	children: React.ReactNode,
	colorScheme?: string
}

const Providers = ({ children, colorScheme = 'bee' }: ProvidersProps) => (
	<VechaiProvider theme={ theme } colorScheme={ colorScheme }>
		{ children }
	</VechaiProvider>
)

export default Providers
