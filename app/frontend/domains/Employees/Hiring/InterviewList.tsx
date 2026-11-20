import { useTranslation } from "react-i18next"

import { Link } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"

export interface InterviewListProps {
	employee: Schema.EmployeesShow
}

export function InterviewList({ employee }: InterviewListProps) {
	const { t } = useTranslation()
	const interviews = [...employee.interviews].sort((left, right) => {
		const leftTime = left.scheduled_at ? new Date(left.scheduled_at).getTime() : 0
		const rightTime = right.scheduled_at ? new Date(right.scheduled_at).getTime() : 0
		return rightTime - leftTime
	})

	return (
		<CollectionPanel
			title={ t("views.employees.show.hiring.interviews") }
			count={ interviews.length }
			emptyLabel={ t("views.employees.show.hiring.empty_interviews") }
		>
			{ interviews.map(interview => (
				<RecordRow
					key={ interview.id }
					title={ (
						<Link href={ Routes.interview(interview.id) }>
							{ interview.scheduled_at
								? <DateTimeFormatter>{ interview.scheduled_at }</DateTimeFormatter>
								: t("views.employees.show.hiring.unscheduled") }
						</Link>
					) }
					meta={ [interview.interview_type, interview.location].filter(Boolean).join(" - ") || undefined }
				/>
			)) }
		</CollectionPanel>
	)
}
