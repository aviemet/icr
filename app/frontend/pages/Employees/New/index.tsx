import { useTranslation } from "react-i18next"

import { Title, Page, Section } from "@/components"
import EmployeeForm from "@/features/Employees/Form"
import { Routes } from "@/lib"

interface INewEmployeeProps {
	employee: Schema.EmployeesFormData
}

const NewEmployee = ({ ...data }: INewEmployeeProps) => {
	const { t } = useTranslation()
	const title = t("views.employees.new.title")

	return (
		<Page title={ title }>
			<Section>
				<Title>{ title }</Title>

				<EmployeeForm
					to={ Routes.employees() }
					{ ...data }
				/>
			</Section>
		</Page>
	)
}

export default NewEmployee
