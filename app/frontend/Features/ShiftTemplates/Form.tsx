import { Grid } from "@/Components"
import { Form, TextInput, Submit } from "@/Components/Form"
import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

type ShiftTemplateFormData = {
	shift_template: Schema.ShiftTemplatesFormData
}

export interface ShiftTemplateFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<ShiftTemplateFormData>) => boolean | void
	shift_template: Schema.ShiftTemplatesFormData
}

const ShiftTemplateForm = ({ method = "post", shift_template, ...props }: ShiftTemplateFormProps) => {
	return (
		<Form
			model="shift_template"
			data={ { shift_template } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="client" label="Client" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="created_by" label="Created_by" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ shift_template.id ? "Update" : "Create" } ShiftTemplate</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default ShiftTemplateForm
