import React from 'react'
import theme from '../layouts/theme'

interface ProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
	return(
		<>
			{ children }
		</>
	)
}

export default Providers
