import React from 'react'
import theme from 'layouts/theme'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { MenuContextProvider } from 'Store'

interface ProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
	console.log({ children })
	return(
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={ theme }>
				<CssBaseline />
				<MenuContextProvider>
					{ children }
				</MenuContextProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	)
}

export default Providers
