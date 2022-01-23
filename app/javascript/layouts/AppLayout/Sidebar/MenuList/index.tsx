import React from 'react'
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

export default MenuList
