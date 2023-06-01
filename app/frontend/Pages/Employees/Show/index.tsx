import { Box } from '@/Components'
import React from 'react'

const Show = ({ employee }) => {
	return (
		<div>
			<h1>Employee Information</h1>
			<Box>
				<h4>Name</h4>
				<div>{ employee.person.first_name } { employee.person.middle_name } { employee.person.last_name }</div>
			</Box>
		</div>
	)
}

export default Show
