import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateInput, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface TerminationFormProps {
	employee: Schema.EmployeesShow
}

export function TerminationForm({ employee }: TerminationFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					status: "terminated",
					inactive_at: new Date(),
					resignation: false,
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
