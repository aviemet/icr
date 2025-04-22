import { Grid } from "@/Components"
import { Form, Textarea, Submit, DateInput } from "@/Components/Form"
import { Routes } from "@/lib"

interface ResignationFormProps {
	employee: Schema.EmployeesShow
}

const ResignationForm = ({ employee }: ResignationFormProps) => {
	return (
		<Form
			model="employee"
			method="put"
			to={ Routes.statusEmployee(employee.slug) }
			data={ {
				employee: {
					status: "terminated",
					inactive_at: new Date(),
					resignation: true,
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
						label="Reason for Resignation"
						placeholder="Enter resignation details"
						required
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Record Resignation</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default ResignationForm
