import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type TrainingFormData = {
	training: Schema.TrainingsFormData
}

export interface TrainingFormProps {
	to: string
	method?: HTTPVerb
	training: Schema.TrainingsFormData
}

export function TrainingForm({ method = "post", to, training, ...props }: TrainingFormProps) {
	return (
		<Form<TrainingFormData>
			action={ to }
			initialData={ { training } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="training.name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="training.description" label="Description" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="training.estimated_minutes" label="Expected Duration" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ training?.id ? "Update" : "Create" } Training</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
