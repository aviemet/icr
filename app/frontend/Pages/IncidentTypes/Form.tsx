import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TIncidentTypeFormData = {
	incident_type: Schema.IncidentTypesFormData
}

export interface IncidentTypeFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TIncidentTypeFormData>) => boolean|void
	incident_type: Schema.IncidentTypesFormData
}

const IncidentTypeForm = ({ method = 'post', incident_type, ...props }: IIncidentTypeFormProps) => {
	return (
		<Form
			model="incident_type"
			data={ { incident_type } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="name" label="Name" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ incident_type.id ? 'Update' : 'Create' } IncidentType</Submit>
				</Grid.Col>
			</Grid.Col>
		</Form>
	)
}

export default IncidentTypeForm
