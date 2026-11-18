import { Box, Button, Link } from "@/components"
import { PlusIcon } from "@/components/Icons"
import { DepartmentTable } from "@/domains/Settings/Departments/Table"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface DepartmentIndexProps {
	departments: Schema.EmployeeDepartmentsIndex[]
}

const DepartmentsIndex = ({ departments }: DepartmentIndexProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="Departments"
				description="Groups for organizing job titles and employees."
				actions={
					<Button
						component={ Link }
						href={ Routes.newSettingsDepartment() }
						leftSection={ <PlusIcon size={ 16 } /> }
					>
						New Department
					</Button>
				}
			/>
			<DepartmentTable records={ departments } />
		</Box>
	)
}

export default withLayout(DepartmentsIndex, "settings")
