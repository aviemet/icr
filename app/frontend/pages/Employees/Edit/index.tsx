import { useTranslation } from "react-i18next"

import { EmployeeForm } from "@/domains/Employees/Form"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface EditEmployeeProps {
	employee: Schema.EmployeesEdit
}

const EditEmployee = ({ employee }: EditEmployeeProps) => {
	const { t } = useTranslation()
	const title = t("views.employees.edit.title")

	return (
		<RecordFormPage
			title={ title }
			description="Update personal details for this employee."
			breadcrumbs={ [
				{ title: t("views.employees.index.title"), href: Routes.employees() },
				{ title: employee.name, href: Routes.employee(employee.slug) },
				{ title },
			] }
		>
			<EmployeeForm
				method="put"
				to={ Routes.employee(employee.slug) }
				employee={ employee }
			/>
		</RecordFormPage>
	)
}

export default EditEmployee
