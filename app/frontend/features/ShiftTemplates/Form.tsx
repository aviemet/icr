import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type ShiftTemplateFormData = {
	shift_template: Schema.ShiftTemplatesFormData
}

export interface ShiftTemplateFormProps {
	to: string
	method?: HTTPVerb
	shift_template: Schema.ShiftTemplatesFormData
}

export function ShiftTemplateForm({ method = "post", to, shift_template, ...props }: ShiftTemplateFormProps) {
	return (
		<Form<ShiftTemplateFormData>
			action={ to }
			initialData={ { shift_template } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="shift_template.name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="shift_template.client" label="Client" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="shift_template.created_by" label="Created_by" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ shift_template.id ? "Update" : "Create" } ShiftTemplate</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
