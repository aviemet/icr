import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form, TextInput, Submit } from "@/components/Form"

type RequirementRequirementFormData = {
	requirement_requirement: Schema.RequirementRequirementsFormData
}

export interface RequirementRequirementFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<RequirementRequirementFormData>) => boolean | void
	requirement_requirement: Schema.RequirementRequirementsFormData
}

const RequirementRequirementForm = ({ method = "post", requirement_requirement, ...props }: RequirementRequirementFormProps) => {
	return (
		<Form
			model="requirement_requirement"
			data={ { requirement_requirement } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="description" label="Description" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="scope_type" label="Scope_type" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="scope_id" label="Scope_id" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ requirement_requirement.id ? "Update" : "Create" } RequirementRequirement</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default RequirementRequirementForm
