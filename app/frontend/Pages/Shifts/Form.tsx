import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
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

const ShiftForm = ({ method = 'post', shift, ...props }: IShiftFormProps) => {
	return (
		<Form
			model="shift"
			data={ { shift } }
			method={ method }
			{ ...props }
		>
			<Grid>

				<Grid.Col>
					<Submit>{ shift.id ? 'Update' : 'Create' } Shift</Submit>
				</Grid.Col>
			</Grid.Col>
		</Form>
	)
}

export default ShiftForm
