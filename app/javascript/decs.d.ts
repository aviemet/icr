export declare module '@mui/material/styles' {
	export interface Theme {
		constants: Record<string, any>
	}
	// allow configuration using `createTheme`
	export interface ThemeOptions {
		constants?: Record<string, any>
	}
}

declare module '**/*.jpg' {
	export default '' as string
}