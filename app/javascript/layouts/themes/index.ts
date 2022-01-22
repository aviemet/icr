import { createTheme } from '@mui/material/styles'
import componentStyleOverrides from './compStyleOverride'
import colors from './colors'
import themePalette from './palette'
import themeTypography from './typography'


const themeOptions = {
	heading: colors.grey900,
	paper: colors.paper,
	backgroundDefault: colors.paper,
	background: colors.primaryLight,
	darkTextPrimary: colors.grey700,
	darkTextSecondary: colors.grey500,
	textDark: colors.grey900,
	menuSelected: colors.secondaryDark,
	menuSelectedBack: colors.secondaryLight,
	divider: colors.grey200,
	borderRadius: 12
}

export const theme = () => createTheme({
	direction: 'ltr',
	palette: themePalette({ ...themeOptions, colors }),
	typography: themeTypography({ ...themeOptions, colors }),
	components: componentStyleOverrides({ ...themeOptions, colors }),
	mixins: {
		toolbar: {
			minHeight: '48px',
			padding: '16px',
			'@media (min-width: 600px)': {
				minHeight: '48px'
			}
		}
	},
	constants: {
		gridSpacing: 3,
		drawerWidth: 260,
		appDrawerWidth: 320,
		...themeOptions
	}
})

export default theme
