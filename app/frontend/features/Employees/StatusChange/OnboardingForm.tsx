import { Grid } from "@/components"
import { Form, Submit, DateInput } from "@/components/Form"
import { Routes } from "@/lib"

interface OnboardingFormProps {
	employee: Schema.EmployeesShow
}

const OnboardingForm = ({ employee }: OnboardingFormProps) => {
	return (
		<Form
			model="employee"
			method="put"
			to={ Routes.statusEmployee(employee.slug) }
			data={ {
				employee: {
					status: "employed",
					active_at: new Date(),
				},
			} }
		>
			<Grid>
				<Grid.Col span={ { xxs: 12 } }>
					<DateInput
						name="active_at"
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

export default OnboardingForm
