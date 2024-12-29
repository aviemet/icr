import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import EmployeesForm from '../Form'

interface EditEmployeeProps {
	employee: Schema.EmployeesEdit
}

const EditEmployee = ({ employee }: EditEmployeeProps) => {
	const title = 'Edit Employee'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Employees', href: Routes.employees() },
			{ title: Employee, href: Routes.employee(employee.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>

				<EmployeesForm
					method='put'
					to={ Routes.employee() }
					employee={ employee }
				/>
			</Section>
		</Page>
	)
}

export default EditEmployee
