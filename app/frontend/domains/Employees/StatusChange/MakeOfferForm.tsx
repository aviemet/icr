import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Routes } from "@/lib"

import { OfferTermsFields } from "./OfferTermsFields"

export interface MakeOfferFormProps {
	employee: Schema.EmployeesShow
}

export function MakeOfferForm({ employee }: MakeOfferFormProps) {
	return (
		<Form
			action={ Routes.employeeOffers(employee.slug) }
			method="post"
			initialData={ {
				return_to: "status",
				offer: {
					job_title_id: employee.desired_job_title_id ?? employee.job_title?.id ?? "",
					rate: employee.desired_compensation ?? "",
					period: employee.desired_compensation_period || "hourly",
					proposed_start_on: "",
					employee_number: employee.number ?? "",
					status: "extended",
					commit: "offer",
					notes: "",
				},
			} }
		>
			<Grid>
				<OfferTermsFields />
				<Grid.Col>
					<Submit>Make Offer</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
