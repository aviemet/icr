import { NewIcon } from "@/Components/Icons"
import { IndexPageTemplate } from "@/Features"
import EmployeesTable from "@/Features/Employees/Table"
import { Routes } from "@/lib"

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
