import { Box } from '@/Components'
import React from 'react'

const Show = ({ client }) => {
	return (
		<div>
			<h1>Client Information</h1>
			<Box>
				<h4>Name</h4>
				<div>{ client.first_name } { client.middle_name } { client.last_name }</div>
			</Box>
		</div>
	)
}

export default Show
