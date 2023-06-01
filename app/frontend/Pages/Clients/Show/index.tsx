import { Box } from '@/Components'
import React from 'react'

const Show = ({ client }) => {
	return (
		<div>
			<h1>Client Information</h1>
			<Box>
				<h4>Name</h4>
				<div>{ client.person.first_name } { client.person.middle_name } { client.person.last_name }</div>
			</Box>
		</div>
	)
}

export default Show
