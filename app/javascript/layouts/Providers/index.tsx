import React from 'react'
import theme from '../theme'
interface ProvidersProps {
	children: React.ReactNode,
	colorScheme?: string
}

const Providers = ({ children, colorScheme = 'bee' }: ProvidersProps) => (
	<>{ children }</>
)

export default Providers
