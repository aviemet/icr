import React, { useEffect, useState } from 'react'
import { Head } from '@inertiajs/inertia-react'

import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'

const AppLayout = ({ children }) => {

	const theme = useTheme()
	const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))

	// Handle left drawer
	const [leftDrawerOpened, setLeftDrawerOpened] = useState(true)
	const handleLeftDrawerToggle = () => {
		setLeftDrawerOpened(!leftDrawerOpened)
	}

	useEffect(() => {
		setLeftDrawerOpened(!matchDownMd)
	}, [matchDownMd])

	return (
		<>
			<Head title="Inclusive Community Resources" />

			<Box sx={ { display: 'flex' } }>
				<CssBaseline />
				{ /* header */ }
				<AppBar
					enableColorOnDark
					position="fixed"
					color="inherit"
					elevation={ 0 }
					sx={ {
						bgcolor: theme.palette.background.default,
						transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
					} }
				>
					<Toolbar>
						<Header handleLeftDrawerToggle={ handleLeftDrawerToggle } />
					</Toolbar>
				</AppBar>

				{ /* drawer */ }
				<Sidebar drawerOpen={ leftDrawerOpened } drawerToggle={ handleLeftDrawerToggle } />

				{ /* main content */ }
				<Main theme={ theme } open={ leftDrawerOpened }>
					{ /* breadcrumb */ }
					{ /* <Breadcrumbs separator={ IconChevronRight } navigation={ navigation } icon title rightAlign /> */ }
					{ children }
				</Main>
			</Box>
		</>
	)
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	...theme.typography.mainContent,
	...(!open && {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		[theme.breakpoints.up('md')]: {
			// marginLeft: -(drawerWidth - 20),
			// width: `calc(100% - ${drawerWidth}px)`
		},
		[theme.breakpoints.down('md')]: {
			marginLeft: '20px',
			// width: `calc(100% - ${drawerWidth}px)`,
			padding: '16px'
		},
		[theme.breakpoints.down('sm')]: {
			marginLeft: '10px',
			// width: `calc(100% - ${drawerWidth}px)`,
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
		// width: `calc(100% - ${drawerWidth}px)`,
		[theme.breakpoints.down('md')]: {
			marginLeft: '20px'
		},
		[theme.breakpoints.down('sm')]: {
			marginLeft: '10px'
		}
	})
}))

export default (page: React.ReactNode) => <AppLayout>{ page }</AppLayout>

