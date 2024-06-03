import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TIdentificationFormData = {
	identification: Schema.IdentificationsFormData
}

export interface IdentificationFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TIdentificationFormData>) => boolean|void
	identification: Schema.IdentificationsFormData
}

const IdentificationForm = ({ method = 'post', identification, ...props }: IdentificationFormProps) => {
	return (
		<Form
			model="identification"
			data={ { identification } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="type" label="Type" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="number" label="Number" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="notes" label="Notes" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="issued_at" label="Issued_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="expires_at" label="Expires_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="extra_fields" label="Extra_fields" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ identification.id ? 'Update' : 'Create' } Identification</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default IdentificationForm
