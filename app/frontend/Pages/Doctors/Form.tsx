import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TDoctorFormData = {
	doctor: Schema.DoctorsFormData
}

export interface DoctorFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TDoctorFormData>) => boolean|void
	doctor: Schema.DoctorsFormData
}

const DoctorForm = ({ method = 'post', doctor, ...props }: DoctorFormProps) => {
	return (
		<Form
			model="doctor"
			data={ { doctor } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="first_name" label="First_name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="last_name" label="Last_name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ doctor.id ? 'Update' : 'Create' } Doctor</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default DoctorForm
