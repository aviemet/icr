import React from 'react'
import IconProvider from './IconProvider'
import UiFrameworkProvider from './UiFrameworkProvider'
import SpotlightProvider from './SpotlightProvider'

import './reset.css'

interface IProviderProps {
	children?: React.ReactNode
}

const Providers = React.memo(({ children }: IProviderProps) => {
	return (
		<UiFrameworkProvider>
			<SpotlightProvider>
				<IconProvider>
					{ children }
				</IconProvider>
			</SpotlightProvider>
		</UiFrameworkProvider>
	)
})

export default Providers
