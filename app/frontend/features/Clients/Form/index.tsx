import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form as Form3, Submit as Submit3 } from "@/components/Form3"
import { Checkbox as Checkbox3, TextInput as TextInput3 } from "@/components/Inputs"

import Ihss from "./Ihss"

export type ClientFormData = {
	client: Partial<Schema.ClientsFormData> & {
		ihss: boolean
	}
}

export interface ClientFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<ClientFormData>) => boolean | void
	client: Schema.ClientsFormData
}

const ClientForm = ({ method = "post", to, client, ...props }: ClientFormProps) => {
	return (
		<>
			<Form3 action={ to } method={ method } initialData={ { client } }>
				<Grid>

					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput3 name="client.person.first_name" label="First Name" />
					</Grid.Col>

					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput3 name="client.person.middle_name" label="Middle Name" />
					</Grid.Col>

					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput3 name="client.person.last_name" label="Last Name" />
					</Grid.Col>

					<Grid.Col>
						<Checkbox3 name="client.ihss" label="Client has IHSS hours" />
					</Grid.Col>
					<Ihss />

					<Grid.Col>
						<Submit3>{ client.id ? "Update" : "Create" } Client</Submit3>
					</Grid.Col>

				</Grid>
			</Form3>

		</>
	)
}

export default ClientForm
