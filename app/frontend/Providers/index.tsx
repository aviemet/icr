import React from 'react'
import theme from '@/layouts/theme'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
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
					<LocalizationProvider dateAdapter={ AdapterDateFns }>
						<CssBaseline />
						<MenuContextProvider>
							{ children }
						</MenuContextProvider>
					</LocalizationProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</AuthContextProvider>
	)
}

export default Providers
