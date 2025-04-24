import { Grid } from "@/components"
import { Form, Textarea, Submit } from "@/components/Form"
import { Routes } from "@/lib"

interface CloseApplicationFormProps {
	employee: Schema.EmployeesShow
}

const CloseApplicationForm = ({ employee }: CloseApplicationFormProps) => {
	return (
		<Form
			model="employee"
			method="put"
			to={ Routes.statusEmployee(employee.slug) }
			data={ {
				employee: {
					status: "application_withdrawn",
				},
			} }
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<Textarea
						name="ineligibility_reason"
						label="Reason (Optional)"
						placeholder="Enter reason for closing application"
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Close Application</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default CloseApplicationForm
