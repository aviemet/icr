import { Grid } from "@/Components"
import { Form, TextInput, Submit } from "@/Components/Form"
import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

type TPersonFormData = {
	person: Schema.PeopleFormData
}

export interface PersonFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TPersonFormData>) => boolean | void
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
