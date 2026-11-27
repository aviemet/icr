import { useTranslation } from "react-i18next"

import { ClockIcon } from "@/components/Icons"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
	MetricValue,
} from "@/features"
import { formatter, Routes } from "@/lib"
import { usePageProps, usePermissions } from "@/lib/hooks"

interface TimePanelProps {
	dashboard: Schema.DashboardStats
}

export function TimePanel({ dashboard }: TimePanelProps) {
	const { t } = useTranslation()
	const { auth } = usePageProps()
	const { can } = usePermissions()
	const canViewPayrollIndex = can("timesheets", "index")
	const hoursLabel = formatter.number.decimal(dashboard.week_tracked_hours, 1)
	const timeTone = dashboard.pending_timesheet_count > 0 ? "alert" : "default"
	const payrollHref = canViewPayrollIndex ? Routes.payrollPeriods() : undefined
	const ownEmployeeHref = auth.own_employee_slug
		? Routes.employee(auth.own_employee_slug)
		: null
	const ownScheduleHref = auth.own_employee_slug
		? Routes.scheduleEmployee(auth.own_employee_slug)
		: null
	const hoursHref = canViewPayrollIndex
		? payrollHref
		: ownScheduleHref ?? ownEmployeeHref ?? undefined
	const hoursLabelKey = canViewPayrollIndex
		? "views.dashboard.time.total_hours_week"
		: "views.dashboard.time.my_hours_week"

	return (
		<MetricTile
			title={ t("views.dashboard.time.title") }
			tone={ timeTone }
			icon={ <ClockIcon size={ 16 } /> }
		>
			<MetricValue
				label={ t(hoursLabelKey) }
				href={ hoursHref ?? undefined }
			>
				{ hoursLabel }
			</MetricValue>
			{ canViewPayrollIndex && (
				<MetricLine
					label={ t("views.dashboard.time.pending_timesheets") }
					value={ (
						<CountChip
							value={ dashboard.pending_timesheet_count }
							alert={ dashboard.pending_timesheet_count > 0 }
						/>
					) }
					href={ payrollHref }
				/>
			) }
			<BoardActionGrid>
				{ canViewPayrollIndex && (
					<BoardActionTile
						href={ Routes.payrollPeriods() }
						title={ t("views.dashboard.time.view") }
						hint="Payroll periods"
					/>
				) }
				{ !canViewPayrollIndex && ownEmployeeHref && (
					<BoardActionTile
						href={ ownEmployeeHref }
						title={ t("views.dashboard.time.view_profile") }
						hint="Open your employee record"
					/>
				) }
			</BoardActionGrid>
		</MetricTile>
	)
}
