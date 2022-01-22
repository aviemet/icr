import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'
import { BrowserView, MobileView } from 'react-device-detect'
import MenuList from './MenuList'
import LogoSection from '../LogoSection'

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }: { drawerOpen: boolean, drawerToggle: () => void, window?: any}) => {
	const theme = useTheme()
	const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

	const drawer = (
		<>
			<Box sx={ { display: { xs: 'block', md: 'none' } } }>
				<Box sx={ { display: 'flex', p: 2, mx: 'auto' } }>
					<LogoSection />
				</Box>
			</Box>
			<BrowserView>
				<MenuList />
			</BrowserView>
			<MobileView>
				<Box sx={ { px: 2 } }>
					<MenuList />
				</Box>
			</MobileView>
		</>
	)

	const container = window !== undefined ? () => window.document.body : undefined

	return (
		<Box component="nav" sx={ { flexShrink: { md: 0 }, width: matchUpMd ? theme.constants.drawerWidth : 'auto' } } aria-label="mailbox folders">
			<Drawer
				container={ container }
				variant={ matchUpMd ? 'persistent' : 'temporary' }
				anchor="left"
				open={ drawerOpen }
				onClose={ drawerToggle }
				sx={ {
					'& .MuiDrawer-paper': {
						width: theme.constants.drawerWidth,
						background: theme.palette.background.default,
						color: theme.palette.text.primary,
						borderRight: 'none',
						[theme.breakpoints.up('md')]: {
							top: '88px'
						}
					}
				} }
				ModalProps={ { keepMounted: true } }
				color="inherit"
			>
				{ drawer }
			</Drawer>
		</Box>
	)
}

export default Sidebar
