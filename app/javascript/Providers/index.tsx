import React from 'react'
import theme from 'layouts/theme'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { MenuContextProvider } from 'Store'

interface ProvidersProps {
	children: React.ReactNode
	auth: any
}

const Providers = ({ children }: ProvidersProps) => {
	return(
		<CssBaseline>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={ theme }>
					<MenuContextProvider>
						{ children }
					</MenuContextProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</CssBaseline>
	)
}

export default Providers
