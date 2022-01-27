import React, { useEffect } from 'react'
import { Head } from '@inertiajs/inertia-react'
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'
import { useMenuState, menuActions } from '@/Store'

const AppLayout = ({ children }) => {
	const theme = useTheme()
	const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))

	const [ { sideMenuOpen }, dispatch ] = useMenuState()

	const handleLeftDrawerToggle = () => {
		dispatch(menuActions.TOGGLE_SIDE_MENU)
	}

	useEffect(() => {
		dispatch(menuActions.OPEN_SIDE_MENU)
	}, [matchDownMd])

	return (
		<>
			<Head title="Inclusive Community Resources" />

			<Box sx={ { display: 'flex' } }>
				{ /* header */ }
				<AppBar
					enableColorOnDark
					position="fixed"
					color="inherit"
					elevation={ 0 }
					sx={ {
						bgcolor: theme.palette.background.default,
						transition: sideMenuOpen ? theme.transitions.create('width') : 'none'
					} }
				>
					<Toolbar>
						<Header handleLeftDrawerToggle={ handleLeftDrawerToggle } />
					</Toolbar>
				</AppBar>

				{ /* drawer */ }
				<Sidebar drawerOpen={ sideMenuOpen } drawerToggle={ handleLeftDrawerToggle } />

				{ /* main content */ }
				<Main theme={ theme } open={ sideMenuOpen }>
					{ /* breadcrumb */ }
					{ /* <Breadcrumbs separator={ IconChevronRight } navigation={ navigation } icon title rightAlign /> */ }
					{ children }
				</Main>
			</Box>
		</>
	)
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	backgroundColor: theme.constants.background,
	width: '100%',
	minHeight: 'calc(100vh - 88px)',
	flexGrow: 1,
	padding: '20px',
	marginTop: '88px',
	marginRight: '20px',
	borderRadius: `${theme.constants.borderRadius}px`,
	...(!open && {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		[theme.breakpoints.up('md')]: {
			marginLeft: -(theme.constants.drawerWidth - 20),
			width: `calc(100% - ${theme.constants.drawerWidth}px)`
		},
		[theme.breakpoints.down('md')]: {
			marginLeft: '20px',
			width: `calc(100% - ${theme.constants.drawerWidth}px)`,
			padding: '16px'
		},
		[theme.breakpoints.down('sm')]: {
			marginLeft: '10px',
			width: `calc(100% - ${theme.constants.drawerWidth}px)`,
			padding: '16px',
			marginRight: '10px'
		}
	}),
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginLeft: 0,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		width: `calc(100% - ${theme.constants.drawerWidth}px)`,
		[theme.breakpoints.down('md')]: {
			marginLeft: '20px'
		},
		[theme.breakpoints.down('sm')]: {
			marginLeft: '10px',
			marginRight: '10px'
		}
	})
}))

export default AppLayout
