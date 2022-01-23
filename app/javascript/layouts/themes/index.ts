import { createTheme } from '@mui/material/styles'
<<<<<<< HEAD

// project imports
import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

const colors =  {
	paper: '#ffffff',

	// primary
	primaryLight: '#e3f2fd',
	primaryMain: '#2196f3',
	primaryDark: '#1e88e5',
	primary200: '#90caf9',
	primary800: '#1565c0',

	// secondary
	secondaryLight: '#ede7f6',
	secondaryMain: '#673ab7',
	secondaryDark: '#5e35b1',
	secondary200: '#b39ddb',
	secondary800: '#4527a0',

	// success Colors
	successLight: '#b9f6ca',
	success200: '#69f0ae',
	successMain: '#00e676',
	successDark: '#00c853',

	// error
	errorLight: '#ef9a9a',
	errorMain: '#f44336',
	errorDark: '#c62828',

	// orange
	orangeLight: '#fbe9e7',
	orangeMain: '#ffab91',
	orangeDark: '#d84315',

	// warning
	warningLight: '#fff8e1',
	warningMain: '#ffe57f',
	warningDark: '#ffc107',

	// grey
	grey50: '#fafafa',
	grey100: '#f5f5f5',
	grey200: '#eeeeee',
	grey300: '#e0e0e0',
	grey500: '#9e9e9e',
	grey600: '#757575',
	grey700: '#616161',
	grey900: '#212121',

	// ==============================|| DARK THEME VARIANTS ||============================== //

	// paper & background
	darkBackground: '#1a223f',
	darkPaper: '#111936',

	// dark 800 & 900
	darkLevel1: '#29314f',
	darkLevel2: '#212946',

	// primary dark
	darkPrimaryLight: '#e3f2fd',
	darkPrimaryMain: '#2196f3',
	darkPrimaryDark: '#1e88e5',
	darkPrimary200: '#90caf9',
	darkPrimary800: '#1565c0',

	// secondary dark
	darkSecondaryLight: '#d1c4e9',
	darkSecondaryMain: '#7c4dff',
	darkSecondaryDark: '#651fff',
	darkSecondary200: '#b39ddb',
	darkSecondary800: '#6200ea',

	// text variants
	darkTextTitle: '#d7dcec',
	darkTextPrimary: '#bdc8f0',
	darkTextSecondary: '#8492c4',
}

export const theme = (customization) => {
	const themeOption = {
		colors,
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
		customization
	}

	const themeOptions = {
		direction: 'ltr',
		palette: themePalette(themeOption),
		mixins: {
			toolbar: {
				minHeight: '48px',
				padding: '16px',
				'@media (min-width: 600px)': {
					minHeight: '48px'
				}
			}
		},
		typography: themeTypography(themeOption)
	}

	const themes = createTheme(themeOptions)
	themes.components = componentStyleOverrides(themeOption)

	return themes
}

export default theme
=======
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


// customInput: {
// 	marginTop: 1,
// 	marginBottom: 1,
// 	'& > label': {
// 		top: 23,
// 		left: 0,
// 		color: theme.grey500,
// 		'&[data-shrink="false"]': {
// 			top: 5
// 		}
// 	},
// 	'& > div > input': {
// 		padding: '30.5px 14px 11.5px !important'
// 	},
// 	'& legend': {
// 		display: 'none'
// 	},
// 	'& fieldset': {
// 		top: 0
// 	}
// },
>>>>>>> mui
