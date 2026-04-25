import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type EmployeeInterviewFormData = {
	employee_interview: Schema.EmployeeInterviewsFormData
}

export interface EmployeeInterviewFormProps {
	to: string
	method?: HTTPVerb
	employee_interview: Schema.EmployeeInterviewsFormData
}

export function EmployeeInterviewForm({ method = "post", to, employee_interview, ...props }: EmployeeInterviewFormProps) {
	return (
		<Form<EmployeeInterviewFormData>
			action={ to }
			initialData={ { employee_interview } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="employee_interview.scheduled_at" label="Scheduled_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="employee_interview.notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ employee_interview.id ? "Update" : "Create" } EmployeeInterview</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
