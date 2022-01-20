import React from 'react'
import { Form } from 'components'

const New = ({ client }) => {
	return (
		<div>
			<h1>New Client</h1>
			<Form>
				<Form.Input name="f_name" placeholder="First Name" />
				<Form.Input name="l_name" placeholder="Last Name" />
			</Form>
		</div>
	)
}

export default New
