export declare module '@mui/material/styles' {
	export interface Theme {
		constants: Record<string, any>
	}
	// allow configuration using `createTheme`
	export interface ThemeOptions {
		constants?: Record<string, any>
	}
}


declare module '@mui/material/styles/createPalette' {
	export interface Palette {
		orange: Partial<Color>
		dark: Partial<Color>
	}

	export interface PaletteOptions {
		orange: Partial<Color>
		dark: Partial<Color>
	}

	export interface TypeText {
		dark: string
		hint: string
	}
}


declare module '**/*.jpg' {
	export default '' as string
}