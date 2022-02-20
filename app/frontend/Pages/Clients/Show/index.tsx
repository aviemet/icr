import { Box } from '@mui/material'
import React from 'react'

const Show = ({ client }) => {
	return (
		<div>
			<h1>Client Information</h1>
			<Box>
				<h4>Name</h4>
				<div>{ client.f_name } { client.m_name } { client.l_name }</div>
			</Box>
		</div>
	)
}

export default Show
