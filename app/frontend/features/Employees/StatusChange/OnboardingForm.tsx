import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateInput } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface OnboardingFormProps {
	employee: Schema.EmployeesShow
}

export function OnboardingForm({ employee }: OnboardingFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					status: "employed",
					active_at: new Date(),
				},
			} }
			method="put"
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<DateInput
						name="employee.active_at"
						label="Start Date"
						required
						valueFormat="YYYY-MM-DD"
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Begin Employment</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
