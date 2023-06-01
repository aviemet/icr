import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import EmployeesForm from '../Form'

interface IEditEmployeeProps {
	employee: Schema.Employee
}

const EditEmployee = ({ employee }: IEditEmployeeProps) => {
	const title = 'Edit Employee'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Employees', href: Routes.employees() },
			{ title: employee.name, href: Routes.employee(employee.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>

				<EmployeesForm
					method='put'
					employee={ employee }
				/>
			</Section>
		</Page>
	)
}

export default EditEmployee
