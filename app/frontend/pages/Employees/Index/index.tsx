import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { EmployeeTable } from "@/features/Employees/Table"
import { Routes } from "@/lib"

interface EmployeeIndexProps {
	employees: Schema.EmployeesIndex[]
	pagination: Schema.Pagination
}

const EmployeesIndex = ({ employees, pagination }: EmployeeIndexProps) => {
	const { t } = useTranslation()

	return (
		<IndexPageTemplate
			title={ t("views.employees.index.title") }
			model="employees"
			rows={ employees }
			pagination={ pagination }
			deleteRoute={ Routes.employees() }
			menuOptions={ [
				{ label: t("views.employees.index.new"), href: Routes.newEmployee(), icon: <NewIcon /> },
			] }
		>
			<EmployeeTable />
		</IndexPageTemplate>
	)
}

export default EmployeesIndex
