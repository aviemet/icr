import React from 'react'
import { ColorScheme, ColorSchemeProvider, Global, MantineProvider } from '@mantine/core'
import { useColorScheme, useLocalStorage } from '@mantine/hooks'
import { Notifications } from '@mantine/notifications'

export const useTheme = (colorScheme: 'light'|'dark' = 'light') => ({
	breakpoints: {
		'hd': '120rem', // 1920px,
		'2xl': '110rem', // 1760px,
		xl: '90rem', // 1440px, default 88rem
		lg: '80rem', // 1280px, default 75rem
		md: '62rem',
		sm: '48rem',
		xs: '36rem',
		'2xs': '30rem', // 480px
	},
	colorScheme,
	defaultRadius: 'xs',
	transitionTimingFunction: 'ease-in-out',
	other: {
		colorSchemeOption: (light: any, dark: any) => colorScheme === 'dark' ? dark : light,
		header: {
			height: 50,
		},
		navbar: {
			width: {
				closed: 50,
				open: 200,
			},
		},
		footer: {
			height: 35,
		},
		table: {
			sortButtonHeight: 5,
			sortButtonWidth: 6,
		},
	},
})

export const GlobalStyles = () => <Global styles={ theme => ({
	'html, body, #app': {
		height: '100%',
	},

	'*::selection': {
		backgroundColor: theme.colors[theme.primaryColor][2],
	},

	':root': {
		colorScheme: theme.colorScheme,
	},

	'.hidden': {
		display: 'none',
	},

	'.fullHeight': {
		display: 'flex',
		flexDirection: 'column',
		height: `calc(100vh - ${theme.other.header.height}px - ${theme.other.footer.height}px - 20px)`,
	},
}) } />

const UiFrameworkProvider = ({ children }: { children: React.ReactNode }) => {
	const systemColorScheme = useColorScheme()
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: 'colorScheme',
		defaultValue: systemColorScheme,
		getInitialValueInEffect: false,
	})

	const toggleColorScheme = (value?: ColorScheme) => {
		const scheme = value || (colorScheme === 'dark' ? 'light' : 'dark')

		setColorScheme(scheme)
	}

	const mantineTheme = useTheme(colorScheme)

	return (
		<ColorSchemeProvider colorScheme={ colorScheme } toggleColorScheme={ toggleColorScheme }>
			<MantineProvider theme={ mantineTheme } withGlobalStyles withNormalizeCSS>
				<Notifications />
				<GlobalStyles />
				{ children }
			</MantineProvider>
		</ColorSchemeProvider>
	)
}

export default UiFrameworkProvider
