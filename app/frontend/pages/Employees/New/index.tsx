import { useTranslation } from "react-i18next"

import { EmployeeForm } from "@/domains/Employees/Form"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface INewEmployeeProps {
	employee: Schema.EmployeesFormData
}

const NewEmployee = ({ ...data }: INewEmployeeProps) => {
	const { t } = useTranslation()
	const title = t("views.employees.new.title")

	return (
		<RecordFormPage
			title={ title }
			description="Add personal details to start employee onboarding."
			breadcrumbs={ [
				{ title: t("views.employees.index.title"), href: Routes.employees() },
				{ title },
			] }
		>
			<EmployeeForm
				to={ Routes.employees() }
				{ ...data }
			/>
		</RecordFormPage>
	)
}

export default NewEmployee
