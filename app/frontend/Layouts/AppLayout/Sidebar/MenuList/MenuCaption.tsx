import React from 'react'
import { Typography } from '@mui/material'

export const MenuCaption = ({ children }) => (
	<Typography variant="caption" sx={ theme => ({
		fontSize: '0.6875rem',
		fontWeight: 500,
		color: theme.constants.darkTextSecondary,
		textTransform: 'capitalize'
	}) } display="block" gutterBottom>
		{ children }
	</Typography>
)

export default MenuCaption
