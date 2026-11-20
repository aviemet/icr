import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface DeclineApplicationFormProps {
	employee: Schema.EmployeesShow
}

export function DeclineApplicationForm({ employee }: DeclineApplicationFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					event: "decline_application",
				},
			} }
			method="put"
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<Textarea
						name="employee.ineligibility_reason"
						label="Reason"
						placeholder="Enter reason for not hiring"
						required
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Not Hired</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
