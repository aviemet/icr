import React from 'react'
import { VechaiProvider } from '@vechaiui/react'

const Providers: React.FC = ({ children }) => (
	<VechaiProvider>
		{ children }
	</VechaiProvider>
)

export default Providers
