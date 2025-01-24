import { Routes } from "@/lib"
import { IndexPageTemplate } from "@/Features"
import { NewIcon } from "@/Components/Icons"
import EmployeesTable from "@/Features/Employees/Table"

interface EmployeeIndexProps {
	employees: Schema.EmployeesIndex[]
	pagination: Schema.Pagination
}

const EmployeesIndex = ({ employees, pagination }: EmployeeIndexProps) => {
	return (
		<IndexPageTemplate
			title="Employees"
			model="employees"
			rows={ employees }
			pagination={ pagination }
			deleteRoute={ Routes.employees() }
			menuOptions={ [
				{ label: "New Employee", href: Routes.newEmployee(), icon: <NewIcon /> },
			] }
		>
			<EmployeesTable />
		</IndexPageTemplate>
	)
}

export default EmployeesIndex
