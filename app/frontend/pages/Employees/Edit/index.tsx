import { useTranslation } from "react-i18next"

import { Title, Page, Section } from "@/components"
import EmployeesForm from "@/features/Employees/Form"
import { Routes } from "@/lib"

interface EditEmployeeProps {
	employee: Schema.EmployeesEdit
}

const EditEmployee = ({ employee }: EditEmployeeProps) => {
	const { t } = useTranslation()
	const title = t("views.employees.edit.title")

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: t("views.employees.index.title"), href: Routes.employees() },
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
