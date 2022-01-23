import React from 'react'
<<<<<<< HEAD
import { Typography } from '@mui/material'

// project imports
import NavGroup from './NavGroup'
import menuItem from 'layouts/menu-items'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
	const navItems = menuItem.items.map((item) => {
		switch (item.type) {
			case 'group':
				return <NavGroup key={ item.id } item={ item } />
			default:
				return (
					<Typography key={ item.id } variant="h6" color="error" align="center">
						Menu Items Error
					</Typography>
				)
		}
	})

	return navItems
}
=======
import { useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import NavGroup from './NavGroup'
import menuItems from 'layouts/AppLayout/menuItems'

// export const MenuTitle = ({ children }) => {
// 	// const theme = useTheme()

// 	return (
// 		<Typography variant="caption" sx={ theme => ({
// 			fontSize: '0.875rem',
// 			fontWeight: 500,
// 			color: theme.constants.heading,
// 			padding: '6px',
// 			textTransform: 'capitalize',
// 			marginTop: '10px'
// 		}) } display="block" gutterBottom>
// 			{ children }
// 		</Typography>
// 	)
// }

// export const MenuCaption = ({ children }) => {
// 	// const theme = useTheme()

// 	return (
// 		<Typography variant="caption" sx={ theme => ({
// 			fontSize: '0.6875rem',
// 			fontWeight: 500,
// 			color: theme.constants.darkTextSecondary,
// 			textTransform: 'capitalize'
// 		}) } display="block" gutterBottom>
// 			{ children }
// 		</Typography>
// 	)
// }

const MenuList = () => <>{ menuItems.map(item => <NavGroup key={ item.id } item={ item } />) }</>
>>>>>>> mui

export default MenuList
