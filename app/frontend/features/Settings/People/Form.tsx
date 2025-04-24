import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form, TextInput, Submit } from "@/components/Form"

type PersonFormData = {
	person: Schema.PeopleFormData
}

export interface PersonFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<PersonFormData>) => boolean | void
	person: Schema.PeopleFormData
}

const PersonForm = ({ method = "post", person, ...props }: PersonFormProps) => {
	return (
		<Form
			model="person"
			data={ { person } }
			method={ method }
			{ ...props }
		>
			<Grid>

				<Grid.Col>
					<TextInput name="first_name" label="First Name" />
				</Grid.Col>

				<Grid.Col>
					<TextInput name="middle_name" label="Middle Name" />
				</Grid.Col>

				<Grid.Col>
					<TextInput name="last_name" label="Last Name" />
				</Grid.Col>

				<Grid.Col>
					<TextInput name="email" label="Email" />
				</Grid.Col>

				<Grid.Col>
					<TextInput name="password" label="Password" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ person.id ? "Update" : "Create" } Person</Submit>
				</Grid.Col>

			</Grid>
		</Form>
	)
}

export default PersonForm
