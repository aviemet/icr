import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TrainingFormData = {
	training: Schema.TrainingsFormData
}

export interface TrainingFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TrainingFormData>) => boolean|void
	training: Schema.TrainingsFormData
}

const TrainingForm = ({ method = 'post', training, ...props }: TrainingFormProps) => {
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
					<TextInput name="estimated_minutes" label="Estimated_minutes" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="active_on" label="Active_on" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="inactive_on" label="Inactive_on" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ training.id ? 'Update' : 'Create' } Training</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default TrainingForm
