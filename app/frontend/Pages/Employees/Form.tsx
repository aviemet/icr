import React from 'react'
import { Routes } from '@/lib'
import { Box, Grid } from '@/Components'
import { Form, Submit, TextInput } from '@/Components/Form'
import { type UseFormProps } from 'use-inertia-form'

interface EmployeeFormProps {
	employee: Schema.Employee
}

export interface IEmployeeFormProps {
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<EmployeeFormProps>) => boolean|void
	employee: Schema.Employee
}

const EmployeesForm = ({ employee, method = 'post' }: IEmployeeFormProps) => {
	return (
		<Form
			model="employee"
			data={ { employee } }
			method={ method }
			to={ Routes.employees() }
		>
			<Grid>
				<Grid.Col xs={ 12 } md={ 4 }>
					<TextInput
						name="first_name"
						label="First Name"
					/>
				</Grid.Col>

				<Grid.Col xs={ 12 } md={ 4 }>
					<TextInput
						name="middle_name"
						label="Middle Name"
					/>
				</Grid.Col>

				<Grid.Col xs={ 12 } md={ 4 }>
					<TextInput
						name="last_name"
						label="Last Name"
					/>
				</Grid.Col>
			</Grid>

			<Box sx={ { mt: 2 } }>
				<Submit>Save Employee</Submit>
			</Box>
		</Form>
	)
}

export default EmployeesForm
