import { Grid } from "@/components"
import { Form, Textarea, Submit, DateInput } from "@/components/Form"
import { Routes } from "@/lib"

interface TerminationFormProps {
	employee: Schema.EmployeesShow
}

const TerminationForm = ({ employee }: TerminationFormProps) => {
	return (
		<Form
			model="employee"
			method="put"
			to={ Routes.statusEmployee(employee.slug) }
			data={ {
				employee: {
					status: "terminated",
					inactive_at: new Date(),
					resignation: false,
				},
			} }
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<DateInput
						name="inactive_at"
						label="Last Day"
						required
						valueFormat="YYYY-MM-DD"
					/>
				</Grid.Col>

				<Grid.Col span={ { xxs: 12 } }>
					<Textarea
						name="termination_reason"
						label="Reason for Termination"
						placeholder="Enter termination details"
						required
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Process Termination</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default TerminationForm
