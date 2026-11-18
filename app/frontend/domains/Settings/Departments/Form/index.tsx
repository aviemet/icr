import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { RichText, TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

export interface DepartmentFormProps {
	to: string
	method?: HTTPVerb
	department: Schema.EmployeeDepartmentsFormData | Schema.EmployeeDepartmentsEdit
}

export function DepartmentForm({ method = "post", department, to, ...props }: DepartmentFormProps) {
	return (
		<Form
			action={ to }
			method={ method }
			initialData={ { department } }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="department.name" label="Name" required />
				</Grid.Col>

				<Grid.Col>
					<RichText name="department.description" label="Description" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ department.id ? "Update" : "Create" } Department</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
