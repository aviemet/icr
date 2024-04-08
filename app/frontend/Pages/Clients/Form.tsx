import React from 'react'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type UseFormProps } from 'use-inertia-form'

type TClientFormData = {
	client: Schema.ClientsFormData
}

export interface IClientFormProps {
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
			<Submit>{ client.id ? 'Update' : 'Create' } Client</Submit>
		</Form>
	)
}

export default ClientForm
