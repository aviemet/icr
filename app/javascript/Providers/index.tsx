import React from 'react'

import themes from 'layouts/themes'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { MenuContextProvider } from 'Store'

const config = {
	// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
	// like '/berry-material-react/react/default'
	basename: '/free',
	defaultPath: '/dashboard/default',
	fontFamily: '\'Roboto\', sans-serif',
	borderRadius: 12
}

interface ProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
	const customization = {
		isOpen: [], // for active default menu
		fontFamily: config.fontFamily,
		borderRadius: config.borderRadius,
		opened: true
	}
	return(
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={ themes(customization) }>
				<MenuContextProvider>
					{ children }
				</MenuContextProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	)
}

export default Providers
