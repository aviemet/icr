import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/Components"
import { Form, TextInput, Submit } from "@/Components/Form"

type TEmployeeFormData = {
	employee: Schema.EmployeesFormData
}

export interface EmployeeFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TEmployeeFormData>) => boolean | void
	employee: Schema.EmployeesFormData
}

const EmployeeForm = ({ method = "post", employee, ...props }: EmployeeFormProps) => {
	return (
		<Form
			model="employee"
			data={ { employee } }
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
					<Submit>{ employee.id ? "Update" : "Create" } Employee</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default EmployeeForm
