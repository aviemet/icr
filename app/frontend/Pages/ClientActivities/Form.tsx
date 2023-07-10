import React from 'react'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type UseFormProps } from 'use-inertia-form'

type TClientActivityFormData = {
	client_activity: Schema.ClientActivitiesFormData
}

export interface IClientActivityFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TClientActivityFormData>) => boolean|void
	client_activity: Schema.ClientActivitiesFormData
}

const ClientActivityForm = ({ method = 'post', client_activity, ...props }: IClientActivityFormProps) => {
	return (
		<Form
			model="client_activity"
			data={ { client_activity } }
			method={ method }
			{ ...props }
		>
			<TextInput name="title" label="Title" />
			<TextInput name="notes" label="Notes" />
			<Submit>{ client_activity.id ? 'Update' : 'Create' } ClientActivity</Submit>
		</Form>
	)
}

export default ClientActivityForm
