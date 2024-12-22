import React from 'react'
import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TEmployeeFormData = {
	employee: Schema.EmployeesFormData
}

export interface EmployeeFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TEmployeeFormData>) => boolean|void
	employee: Schema.EmployeesFormData
}

const EmployeeForm = ({ method = 'post', employee, ...props }: EmployeeFormProps) => {
	return (
		<Form
			model="employee"
			data={ { employee } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="active_at" label="Active_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="inactive_at" label="Inactive_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="number" label="Number" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ employee.id ? 'Update' : 'Create' } Employee</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default EmployeeForm
