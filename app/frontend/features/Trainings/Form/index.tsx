import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form, TextInput, Submit } from "@/components/Form"

type TrainingFormData = {
	training: Schema.TrainingsFormData
}

export interface TrainingFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TrainingFormData>) => boolean | void
	training: Schema.TrainingsFormData
}

const TrainingForm = ({ method = "post", training, ...props }: TrainingFormProps) => {
	return (
		<Form
			model="training"
			data={ { training } }
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
					<TextInput name="estimated_minutes" label="Expected Duration" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ training?.id ? "Update" : "Create" } Training</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default TrainingForm
