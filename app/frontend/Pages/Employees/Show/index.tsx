import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import EmployeeForm from '../Form'

interface NewEmployeeProps {
	employee: Schema.EmployeesFormData
}

const NewEmployee = ({ ...data }: NewEmployeeProps) => {
	const title = 'New Employee'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Employees', href: Routes.employees() },
			{ title: 'New Employee' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<EmployeeForm
					to={ Routes.employees() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewEmployee
