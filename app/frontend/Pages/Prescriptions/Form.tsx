import { Grid } from "@/Components"
import { Form, TextInput, Submit } from "@/Components/Form"
import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

type TPrescriptionFormData = {
	prescription: Schema.PrescriptionsFormData
}

export interface PrescriptionFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TPrescriptionFormData>) => boolean | void
	prescription: Schema.PrescriptionsFormData
}

const PrescriptionForm = ({ method = "post", prescription, ...props }: PrescriptionFormProps) => {
	return (
		<Form
			model="prescription"
			data={ { prescription } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="start_at" label="Start_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="ends_at" label="Ends_at" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ prescription.id ? "Update" : "Create" } Prescription</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default PrescriptionForm
