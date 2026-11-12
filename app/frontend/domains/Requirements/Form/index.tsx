import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type RequirementRequirementFormData = {
	requirement_requirement: Schema.RequirementRequirementsFormData
}

export interface RequirementRequirementFormProps {
	to: string
	method?: HTTPVerb
	requirement_requirement: Schema.RequirementRequirementsFormData
}

export function RequirementRequirementForm({ method = "post", to, requirement_requirement, ...props }: RequirementRequirementFormProps) {
	return (
		<Form<RequirementRequirementFormData>
			action={ to }
			initialData={ { requirement_requirement } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="requirement_requirement.name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="requirement_requirement.description" label="Description" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="requirement_requirement.scope_type" label="Scope_type" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="requirement_requirement.scope_id" label="Scope_id" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ requirement_requirement.id ? "Update" : "Create" } RequirementRequirement</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
