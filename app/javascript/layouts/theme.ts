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
export const bee: ColorScheme = {
	id: 'bee',
	type: 'light',
	colors: {
		bg: {
			base: colors.warmGray['100'],
			fill: colors.warmGray['100'],
		},
		text: {
			foreground: colors.warmGray['900'],
			muted: colors.warmGray['700'],
		},
		primary: colors.amber,
		neutral: colors.warmGray,
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
		cool,
		bee
	},
})

export default theme
