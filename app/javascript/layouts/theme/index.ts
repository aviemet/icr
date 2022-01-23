import { createTheme } from '@mui/material/styles'
import componentStyleOverrides from './compStyleOverride'
import colors from './colors'
import themePalette from './palette'
import themeTypography from './typography'


const themeOptions = {
	fontFamily: '\'Roboto\', sans-serif',
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
	borderRadius: 8
}

export const theme = createTheme({
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
		...themeOptions,
		gridSpacing: 3,
		drawerWidth: 260,
		appDrawerWidth: 320,

		commonAvatar: {
			cursor: 'pointer',
			borderRadius: '8px'
		},
		smallAvatar: {
			width: '22px',
			height: '22px',
			fontSize: '1rem',
			lineHeight: '1rem',
		},
		mediumAvatar: {
			width: '34px',
			height: '34px',
			fontSize: '1.2rem',
			lineHeight: '1.2rem',
		},
		largeAvatar: {
			width: '44px',
			height: '44px',
			fontSize: '1.5rem',
			lineHeight: '1.5rem',
		}
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
