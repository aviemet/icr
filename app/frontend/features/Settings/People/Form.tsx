import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type PersonFormData = {
	person: Schema.PeopleFormData
}

export interface PersonFormProps {
	to: string
	method?: HTTPVerb
	person: Schema.PeopleFormData
}

export function PersonForm({ method = "post", to, person, ...props }: PersonFormProps) {
	return (
		<Form<PersonFormData>
			action={ to }
			initialData={ { person } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="person.first_name" label="First Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="person.middle_name" label="Middle Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="person.last_name" label="Last Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="person.email" label="Email" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="person.password" label="Password" />
				</Grid.Col>
				<Grid.Col>
					<Submit>{ person.id ? "Update" : "Create" } Person</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
