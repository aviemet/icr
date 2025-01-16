import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type ClientFormData = {
	client: Schema.ClientsFormData
}

export interface ClientFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<ClientFormData>) => boolean | void
	client: Schema.ClientsFormData
}

const ClientForm = ({ method = 'post', client, ...props }: ClientFormProps) => {
	return (
		<Form
			model="client"
			data={ { client } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<TextInput name="person.first_name" label="First Name" />
				</Grid.Col>

				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<TextInput name="person.middle_name" label="Middle Name" />
				</Grid.Col>

				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<TextInput name="person.last_name" label="Last Name" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ client.id ? 'Update' : 'Create' } Client</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default ClientForm
