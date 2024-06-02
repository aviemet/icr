import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TDosageFormData = {
	dosage: Schema.DosagesFormData
}

export interface DosageFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TDosageFormData>) => boolean|void
	dosage: Schema.DosagesFormData
}

const DosageForm = ({ method = 'post', dosage, ...props }: IDosageFormProps) => {
	return (
		<Form
			model="dosage"
			data={ { dosage } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="amount" label="Amount" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="amount_unit" label="Amount_unit" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="freq_amount" label="Freq_amount" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="freq_period" label="Freq_period" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ dosage.id ? 'Update' : 'Create' } Dosage</Submit>
				</Grid.Col>
			</Grid.Col>
		</Form>
	)
}

export default DosageForm
