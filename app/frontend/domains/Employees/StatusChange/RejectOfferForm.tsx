import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Routes } from "@/lib"

export interface RejectOfferFormProps {
	employee: Schema.EmployeesShow
}

export function RejectOfferForm({ employee }: RejectOfferFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					event: "reject_offer",
				},
			} }
			method="put"
		>
			<Grid>
				<Grid.Col>
					<Submit>Reject Offer</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
