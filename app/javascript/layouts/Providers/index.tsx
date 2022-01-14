import React from 'react'
import theme from '../theme'
interface ProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
	return(
		<div id="providers">{ children }</div>
	)
}

export default Providers
