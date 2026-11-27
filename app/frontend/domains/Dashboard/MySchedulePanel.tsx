import { useTranslation } from "react-i18next"

import { CalendarIcon } from "@/components/Icons"
import {
	BoardActionGrid,
	BoardActionTile,
	MetricTile,
} from "@/features"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import { ShiftList } from "./ShiftList"

interface MySchedulePanelProps {
	dashboard: Schema.DashboardStats
}

export function MySchedulePanel({ dashboard }: MySchedulePanelProps) {
	const { t } = useTranslation()
	const { auth } = usePageProps()
	const showMySchedule = !dashboard.staffing_visible && Boolean(auth.own_employee_slug)

	if(!showMySchedule) return null

	const ownScheduleHref = auth.own_employee_slug
		? Routes.scheduleEmployee(auth.own_employee_slug)
		: null

	return (
		<MetricTile
			title={ t("views.dashboard.my_schedule.title") }
			icon={ <CalendarIcon size={ 16 } /> }
		>
			<ShiftList
				shifts={ dashboard.my_upcoming_shifts }
				emptyLabel={ t("views.dashboard.my_schedule.empty") }
			/>
			{ ownScheduleHref && (
				<BoardActionGrid>
					<BoardActionTile
						href={ ownScheduleHref }
						title={ t("views.dashboard.my_schedule.view") }
						hint="Open your schedule"
					/>
				</BoardActionGrid>
			) }
		</MetricTile>
	)
}
