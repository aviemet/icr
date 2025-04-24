import { Title, Page, Section } from "@/Components"
import EmployeesForm from "@/Features/Employees/Form"
import { Routes } from "@/lib"

interface EditEmployeeProps {
	employee: Schema.EmployeesEdit
}

const EditEmployee = ({ employee }: EditEmployeeProps) => {
	const title = "Edit Employee"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Employees", href: Routes.employees() },
			{ title: title, href: Routes.employee(employee.slug) },
			{ title },
		] }>
			<Section>
				<Title>{ title }</Title>

				<EmployeesForm
					method="put"
					to={ Routes.employee(employee.slug) }
					employee={ employee }
				/>
			</Section>
		</Page>
	)
}

export default EditEmployee
