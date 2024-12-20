import { StateCreator } from 'zustand'
import { isLightColor, type MantinePrimaryShade, type MantineTheme } from '@mantine/core'

export interface ContrastingColorSlice {
	contrastingColorsMap: Map<string, string>
	setThemeData: (theme: MantineTheme, colorScheme: 'light' | 'dark') => void
	getContrastingColor: (color: string) => string

}

export const createConstrastingColorSlice: StateCreator<ContrastingColorSlice> = (set, get) => {
	let theme: MantineTheme | null = null
	let colorScheme: 'light' | 'dark' | null = null

	const calculateContrastingColor = (color: string): string => {
		const black = theme?.black || '#000'
		const white = theme?.white || '#fff'

		if(color === 'black') return white
		if(color === 'white' || color === undefined) return black

		if(!theme || !colorScheme) {
			return black
		}

		const colors = theme.colors
		const primaryShade = theme.primaryShade as MantinePrimaryShade
		let validatedColor = color

		if(color.charAt(0) !== '#' && Object.keys(colors).includes(color)) {
			const shade = primaryShade[colorScheme]
			validatedColor = colors[color][shade]
		}

		const luminanceThreshold = 0.1
		return isLightColor(validatedColor, luminanceThreshold) ? black : white
	}

	return {
		contrastingColorsMap: new Map(),

		setThemeData: (newTheme: MantineTheme, newColorScheme: 'light' | 'dark') => {
			theme = newTheme
			colorScheme = newColorScheme
		},

		getContrastingColor: (color: string): string => {
			const { contrastingColorsMap } = get()

			if(contrastingColorsMap.has(color)) {
				return contrastingColorsMap.get(color)!
			}

			const contrastingColor = calculateContrastingColor(color)
			const updatedMap = new Map(contrastingColorsMap)
			updatedMap.set(color, contrastingColor)
			set({ contrastingColorsMap: updatedMap })

			return contrastingColor
		},

	}
}

