import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TClientFormData = {
	client: Schema.ClientsFormData
}

export interface ClientFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TClientFormData>) => boolean|void
	client: Schema.ClientsFormData
}

const ClientForm = ({ method = 'post', client, ...props }: IClientFormProps) => {
	return (
		<Form
			model="client"
			data={ { client } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="active_at" label="Active_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="inactive_at" label="Inactive_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="number" label="Number" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ client.id ? 'Update' : 'Create' } Client</Submit>
				</Grid.Col>
			</Grid.Col>
		</Form>
	)
}

export default ClientForm
