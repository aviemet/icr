import React from 'react'
import theme from '@/layouts/theme'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { MenuContextProvider, AuthContextProvider } from '@/Store'

interface ProvidersProps {
	children: React.ReactNode
	auth: any
}

const Providers = ({ children, auth }: ProvidersProps) => {
	return(
		<AuthContextProvider auth={ auth }>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={ theme }>
					<CssBaseline />
					<MenuContextProvider>
						{ children }
					</MenuContextProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</AuthContextProvider>
	)
}

export default Providers
