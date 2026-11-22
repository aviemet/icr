import { useTranslation } from "react-i18next"

import { DangerousHtml, Link } from "@/components"
import { DefinitionItem, DefinitionList, FormBand } from "@/features"

export interface HiringDetailsProps {
	employee: Schema.EmployeesShow
}

export function HiringDetails({ employee }: HiringDetailsProps) {
	const { t } = useTranslation()
	const compensation = employee.desired_compensation
		? `${employee.desired_compensation} (${employee.desired_compensation_period})`
		: "-"
	const notes = employee.hiring_notes
		? <DangerousHtml>{ employee.hiring_notes }</DangerousHtml>
		: "-"

	return (
		<FormBand title={ t("views.employees.show.hiring.details") }>
			<DefinitionList>
				<DefinitionItem label={ t("views.employees.show.hiring.source") } value={ employee.application_source || "-" } />
				<DefinitionItem label={ t("views.employees.show.hiring.desired_compensation") } value={ compensation } />
				<DefinitionItem
					label={ t("views.employees.show.hiring.resume") }
					value={ employee.resume
						? <Link href={ employee.resume.url } target="_blank">{ employee.resume.filename }</Link>
						: "-" }
				/>
				<DefinitionItem
					label={ t("views.employees.show.hiring.cover_letter") }
					value={ employee.cover_letter
						? <Link href={ employee.cover_letter.url } target="_blank">{ employee.cover_letter.filename }</Link>
						: "-" }
				/>
				<DefinitionItem label={ t("views.employees.show.hiring.notes") } value={ notes } fullWidth />
			</DefinitionList>
		</FormBand>
	)
}
