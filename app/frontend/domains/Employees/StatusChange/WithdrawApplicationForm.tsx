import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface WithdrawApplicationFormProps {
	employee: Schema.EmployeesShow
}

export function WithdrawApplicationForm({ employee }: WithdrawApplicationFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					event: "withdraw_application",
				},
			} }
			method="put"
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<Textarea
						name="employee.ineligibility_reason"
						label="Reason"
						placeholder="Enter reason for withdrawing application"
						required
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Withdraw Application</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
