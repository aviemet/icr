import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { EmployeeTable } from "@/domains/Employees/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

interface EmployeeIndexProps {
	employees: Schema.EmployeesIndex[]
	pagination: Schema.Pagination
	job_title_options: string[]
}

const EmployeesIndex = ({ employees, pagination, job_title_options }: EmployeeIndexProps) => {
	const { t } = useTranslation()

	return (
		<IndexPageTemplate
			title={ t("views.employees.index.title") }
			model="employees"
			pagination={ pagination }
			deleteRoute={ Routes.employees() }
			actions={ [
				{ label: t("views.employees.index.new"), href: Routes.newEmployee(), icon: <NewIcon /> },
			] }
		>
			<EmployeeTable
				records={ employees }
				model="employees"
				jobTitleOptions={ job_title_options }
				serverFiltered
			/>
		</IndexPageTemplate>
	)
}

export default EmployeesIndex
