import React from 'react'
import { Typography } from '@mui/material'

const MenuTitle = ({ children }) => (
	<Typography variant="caption" sx={ theme => ({
		fontSize: '0.875rem',
		fontWeight: 500,
		color: theme.constants.heading,
		padding: '6px',
		textTransform: 'capitalize',
		marginTop: '10px'
	}) } display="block" gutterBottom>
		{ children }
	</Typography>
)

export default MenuTitle
