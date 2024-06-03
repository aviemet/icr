import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit, RichText } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TShiftFormData = {
	shift: Schema.ShiftsFormData
}

export interface ShiftFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TShiftFormData>) => boolean|void
	shift: Schema.ShiftsFormData
}

const ShiftForm = ({ method = 'post', shift, ...props }: ShiftFormProps) => {
	return (
		<Form
			model="shift"
			data={ { shift } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="title" />
				</Grid.Col>

				<Grid.Col>
					<RichText name="description" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ shift.id ? 'Update' : 'Create' } Shift</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default ShiftForm
