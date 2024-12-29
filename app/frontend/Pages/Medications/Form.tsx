import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TMedicationFormData = {
	medication: Schema.MedicationsFormData
}

export interface MedicationFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TMedicationFormData>) => boolean | void
	medication: Schema.MedicationsFormData
}

const MedicationForm = ({ method = 'post', medication, ...props }: MedicationFormProps) => {
	return (
		<Form
			model="medication"
			data={ { medication } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="generic_name" label="Generic_name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ medication.id ? 'Update' : 'Create' } Medication</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default MedicationForm
