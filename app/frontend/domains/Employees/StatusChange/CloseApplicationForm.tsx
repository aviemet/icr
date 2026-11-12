import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface CloseApplicationFormProps {
	employee: Schema.EmployeesShow
}

export function CloseApplicationForm({ employee }: CloseApplicationFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					status: "application_withdrawn",
				},
			} }
			method="put"
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<Textarea
						name="employee.ineligibility_reason"
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
