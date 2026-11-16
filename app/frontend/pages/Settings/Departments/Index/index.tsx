import { NewIcon } from "@/components/Icons"
import { DepartmentTable } from "@/domains/Settings/Departments/Table"
import { IndexPageTemplate } from "@/features"
import { Routes, withLayout } from "@/lib"

interface DepartmentIndexProps {
	departments: Schema.EmployeeDepartmentsIndex[]
	pagination: Schema.Pagination
}

const DepartmentsIndex = ({ departments, pagination }: DepartmentIndexProps) => {
	return (
		<IndexPageTemplate
			title="Departments"
			model="departments"
			pagination={ pagination }
			deleteRoute={ Routes.settingsDepartments() }
			menuOptions={ [
				{ label: "New Department", href: Routes.newSettingsDepartment(), icon: <NewIcon /> },
			] }
		>
			<DepartmentTable records={ departments } pagination={ pagination } model="departments" />
		</IndexPageTemplate>
	)
}

export default withLayout(DepartmentsIndex, "settings")
