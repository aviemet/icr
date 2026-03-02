import { Grid } from "@/components"
import { Form as Form3, DynamicFields, Submit as Submit3 } from "@/components/Form3"
import { Checkbox as Checkbox3, TextInput as TextInput3 } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

import Ihss from "./Ihss"

export type ClientFormData = {
	client: Partial<Schema.ClientsFormData> & {
		ihss: boolean
		phone_numbers?: { number: string }[]
	}
}

export interface ClientFormProps {
	to: string
	method?: HTTPVerb
	client: Schema.ClientsFormData & { phone_numbers?: { number: string }[] }
}

const ClientForm = ({ method = "post", to, client, ...props }: ClientFormProps) => {
	return (
		<Form3 action={ to } method={ method } initialData={ { client } } { ...props }>
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

				<Grid.Col span={ 12 }>
					<DynamicFields
						basePath="client.phone_numbers"
						initialCount={ client.phone_numbers?.length ?? 0 }
					>
						{ (_, namePrefix) => (
							<TextInput3 name={ `${namePrefix}.number` } label="Phone number" />
						) }
					</DynamicFields>
				</Grid.Col>

				<Ihss />

				<Grid.Col>
					<Submit3>{ client.id ? "Update" : "Create" } Client</Submit3>
				</Grid.Col>

			</Grid>
		</Form3>
	)
}

export default ClientForm
