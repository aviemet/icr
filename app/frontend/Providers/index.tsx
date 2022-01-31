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
		<LocalizationProvider dateAdapter={ AdapterDateFns }>
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
		</LocalizationProvider>
	)
}

export default Providers
