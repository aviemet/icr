import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { ApplicantTable } from "@/domains/Applicants/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface ApplicantsIndexProps {
	employees: Schema.EmployeesIndex[]
	can_updates: Record<string, boolean>
	pagination: Schema.Pagination
	job_title_options: string[]
}

const ApplicantsIndex = ({ employees, can_updates, pagination, job_title_options }: ApplicantsIndexProps) => {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canCreate = can("employees", "create")

	return (
		<IndexPageTemplate
			title={ t("views.applicants.index.title") }
			model="employees"
			pagination={ pagination }
			deleteRoute={ Routes.employees() }
			dense
			actions={ canCreate
				? [
					{ label: t("views.applicants.index.new"), href: Routes.newEmployee(), icon: <NewIcon /> },
				]
				: [] }
		>
			<ApplicantTable
				records={ employees }
				canUpdates={ can_updates }
				model="employees"
				jobTitleOptions={ job_title_options }
			/>
		</IndexPageTemplate>
	)
}

export default ApplicantsIndex
