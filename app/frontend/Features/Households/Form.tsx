import { Form, TextInput, Submit } from "@/Components/Form"
import { type UseFormProps } from "use-inertia-form"

type THouseholdFormData = {
	household: Schema.HouseholdsFormData
}

export interface IHouseholdFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<THouseholdFormData>) => boolean | void
	household: Schema.HouseholdsFormData
}

const HouseholdForm = ({ method = "post", household, ...props }: IHouseholdFormProps) => {
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

export default HouseholdForm
