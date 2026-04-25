import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateInput, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface ResignationFormProps {
	employee: Schema.EmployeesShow
}

export function ResignationForm({ employee }: ResignationFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					status: "terminated",
					inactive_at: new Date(),
					resignation: true,
				},
			} }
			method="put"
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<DateInput
						name="employee.inactive_at"
						label="Last Day"
						required
						valueFormat="YYYY-MM-DD"
					/>
				</Grid.Col>

				<Grid.Col span={ { xxs: 12 } }>
					<Textarea
						name="employee.termination_reason"
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
