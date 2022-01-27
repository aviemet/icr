import React from 'react'
import Form from '../Form'

const New = ({ client }) => {
	return (
		<div>
			<h1>New Client</h1>
			<Form client={ client } />
		</div>
	)
}

export default New
