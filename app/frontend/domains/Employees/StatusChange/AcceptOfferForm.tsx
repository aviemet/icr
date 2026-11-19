import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateInput } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface AcceptOfferFormProps {
	employee: Schema.EmployeesShow
}

export function AcceptOfferForm({ employee }: AcceptOfferFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					event: "accept_offer",
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
					<Submit>Accept Offer</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
