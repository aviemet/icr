import React from 'react'
import Form from '../Form'

const New = ({ employee }) => {
	return (
		<div>
			<h1>New Employee</h1>
			<Form employee={ employee } />
		</div>
	)
}

export default New
