import { Grid } from "@/components"
import { DynamicFields, Form, Submit } from "@/components/Form"
import { Checkbox, TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

import { Ihss } from "./Ihss"

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

export function ClientForm({ method = "post", to, client, ...props }: ClientFormProps) {

	return (
		<Form action={ to } method={ method } initialData={ { client } } { ...props }>
			<Grid>

				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<TextInput name="client.person.first_name" label="First Name" />
				</Grid.Col>

				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<TextInput name="client.person.middle_name" label="Middle Name" />
				</Grid.Col>

				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<TextInput name="client.person.last_name" label="Last Name" />
				</Grid.Col>

				<Grid.Col>
					<Checkbox name="client.ihss" label="Client has IHSS hours" />
				</Grid.Col>

				<Grid.Col span={ 12 }>
					<DynamicFields
						basePath="client.phone_numbers"
						initialCount={ client.phone_numbers?.length ?? 0 }
					>
						{ (_, namePrefix) => (
							<TextInput name={ `${namePrefix}.number` } label="Phone number" />
						) }
					</DynamicFields>
				</Grid.Col>

				<Ihss />

				<Grid.Col>
					<Submit>{ client.id ? "Update" : "Create" } Client</Submit>
				</Grid.Col>

			</Grid>
		</Form>
	)
}
