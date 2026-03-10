import { type UseFormProps } from "use-inertia-form"

import { Form, Submit } from "@/components/Form"
import { type HTTPVerb } from "@/lib"

type THouseholdFormData = {
	household: Schema.HouseholdsFormData
}

export interface IHouseholdFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<THouseholdFormData>) => boolean | void
	household: Schema.HouseholdsFormData
}

export function HouseholdForm({ method = "post", household, ...props }: IHouseholdFormProps) {
	return (
		<Form
			model="household"
			data={ { household } }
			method={ method }
			{ ...props }
		>
			<Submit>{ household.id ? "Update" : "Create" } Household</Submit>
		</Form>
	)
}
