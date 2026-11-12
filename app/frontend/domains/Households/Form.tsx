import { Form, Submit } from "@/components/Form"
import { type HTTPVerb } from "@/lib"

type THouseholdFormData = {
	household: Schema.HouseholdsFormData
}

export interface IHouseholdFormProps {
	to: string
	method?: HTTPVerb
	household: Schema.HouseholdsFormData
}

export function HouseholdForm({ method = "post", to, household, ...props }: IHouseholdFormProps) {
	return (
		<Form<THouseholdFormData>
			action={ to }
			initialData={ { household } }
			method={ method }
			{ ...props }
		>
			<Submit>{ household.id ? "Update" : "Create" } Household</Submit>
		</Form>
	)
}
