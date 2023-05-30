import React from 'react'
import { Routes } from '@/lib'
import { Box, Grid } from '@/Components'
import { Form, Submit, TextInput } from '@/Components/Form'
import { type UseFormProps } from 'use-inertia-form'

interface ClientFormProps {
	client: Schema.Client
}

export interface IClientFormProps {
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<ClientFormProps>) => boolean|void
	client: Schema.Client
}

const ClientsForm = ({ client, method = 'post' }: IClientFormProps) => {
	return (
		<Form
			model="client"
			data={ { client } }
			method={ method }
			to={ Routes.clients() }
		>
			<Grid>
				<Grid.Col xs={ 12 } md={ 4 }>
					<TextInput
						name="f_name"
						label="First Name"
					/>
				</Grid.Col>

				<Grid.Col xs={ 12 } md={ 4 }>
					<TextInput
						name="m_name"
						label="Middle Name"
					/>
				</Grid.Col>

				<Grid.Col xs={ 12 } md={ 4 }>
					<TextInput
						name="l_name"
						label="Last Name"
					/>
				</Grid.Col>
			</Grid>

			<Box sx={ { mt: 2 } }>
				<Submit>Save Client</Submit>
			</Box>
		</Form>
	)
}

export default ClientsForm
