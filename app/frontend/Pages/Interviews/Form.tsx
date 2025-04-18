import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type EmployeeInterviewFormData = {
	employee_interview: Schema.EmployeeInterviewsFormData
}

export interface EmployeeInterviewFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<EmployeeInterviewFormData>) => boolean|void
	employee_interview: Schema.EmployeeInterviewsFormData
}

const EmployeeInterviewForm = ({ method = 'post', employee_interview, ...props }: EmployeeInterviewFormProps) => {
	return (
		<Form
			model="employee_interview"
			data={ { employee_interview } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="scheduled_at" label="Scheduled_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ employee_interview.id ? 'Update' : 'Create' } EmployeeInterview</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default EmployeeInterviewForm
