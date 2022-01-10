// 1. Import `extendTheme`
import { extendTheme, colors, ColorScheme } from '@vechaiui/react'

// 2.Define new color scheme
const cool: ColorScheme = {
	id: 'cool',
	type: 'dark',
	colors: {
		bg: {
			base: colors.coolGray['900'],
			fill: colors.coolGray['900'],
		},
		text: {
			foreground: colors.coolGray['100'],
			muted: colors.coolGray['300'],
		},
		primary: colors.cyan,
		neutral: colors.coolGray,
	},
}

// or custom default color scheme
const light: ColorScheme = {
	id: 'light',
	type: 'light',
	colors: {
		bg: {
			base: colors.gray['800'],
			fill: colors.gray['900'],
		},
		text: {
			foreground: colors.gray['100'],
			muted: colors.gray['300'],
		},
		primary: colors.teal,
		neutral: colors.gray,
	},
}

// 3. Call `extendTheme` and pass your custom values
const theme = extendTheme({
	cursor: 'pointer',
	colorSchemes: {
		light,
		cool
	},
})

export default theme