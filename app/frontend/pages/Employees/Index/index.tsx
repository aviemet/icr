import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { EmployeeTable } from "@/domains/Employees/Table"
import {
	EmployeeIndexScopeMenu,
	type WorkforceView,
} from "@/domains/Employees/Table/EmployeeIndexScopeMenu"
import {
	searchCluster,
	searchWithLeading,
} from "@/domains/Employees/Table/EmployeeIndexScopeMenu.css"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface EmployeeIndexProps {
	employees: Schema.EmployeesIndex[]
	can_updates: Record<string, boolean>
	pagination: Schema.Pagination
	job_title_options: string[]
	can_scope_employees: boolean
	workforce_view: WorkforceView
}

const EmployeesIndex = ({
	employees,
	can_updates,
	pagination,
	job_title_options,
	can_scope_employees,
	workforce_view,
}: EmployeeIndexProps) => {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canCreate = can("employees", "create")

	return (
		<IndexPageTemplate
			title={ t("views.employees.index.title") }
			model="employees"
			pagination={ pagination }
			deleteRoute={ Routes.employees() }
			dense
			actions={ canCreate
				? [
					{ label: t("views.employees.index.new"), href: Routes.newEmployee(), icon: <NewIcon /> },
				]
				: [] }
			searchLeading={ can_scope_employees
				? <EmployeeIndexScopeMenu value={ workforce_view } />
				: undefined }
			searchClusterClassName={ can_scope_employees ? searchCluster : undefined }
			searchInputClassName={ can_scope_employees ? searchWithLeading : undefined }
		>
			<EmployeeTable
				records={ employees }
				canUpdates={ can_updates }
				model="employees"
				jobTitleOptions={ job_title_options }
				serverFiltered
			/>
		</IndexPageTemplate>
	)
}

export default EmployeesIndex
