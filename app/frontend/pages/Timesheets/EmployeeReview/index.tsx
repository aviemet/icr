import { useTranslation } from "react-i18next"

import { Page } from "@/components"
import { EmployeeReviewBoard } from "@/domains/TimeSheets/EmployeeReviewBoard"
import { Routes } from "@/lib"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
	ihss_hours?: number
	company_hours?: number
}

interface UnreviewedShiftRow {
	id: string
	starts_at?: string
	client_names: string[]
}

interface TimesheetsEmployeeReviewProps {
	employee: Schema.EmployeesIndex
	pay_period_id: string
	pay_period_slug: string
	period_dates: [Date, Date]
	approval_window_open: boolean
	finalized: boolean
	can_approve: boolean
	timesheet: Schema.TimesheetsShow | null
	shifts: Schema.ShiftsReview[]
	shift_exception_reasons: Record<string, string[]>
	shift_ot_hours: Record<string, number>
	employee_hours: EmployeeHoursMap
	unreviewed_shifts?: UnreviewedShiftRow[]
	ihss_assignment_mode?: string
	can_edit_ihss?: boolean
}

export default function TimesheetsEmployeeReview({
	employee,
	pay_period_id,
	pay_period_slug,
	period_dates,
	finalized,
	can_approve,
	timesheet,
	shifts,
	shift_exception_reasons = {},
	shift_ot_hours = {},
	employee_hours,
	unreviewed_shifts = [],
	ihss_assignment_mode = "shift",
	can_edit_ihss = false,
}: TimesheetsEmployeeReviewProps) {
	const { t } = useTranslation()

	return (
		<Page
			title={ t("views.timesheets.employee_review.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
				{ title: t("views.pay_periods.show.title"), href: Routes.period(pay_period_slug) },
				{ title: t("views.timesheets.employee_review.title") },
			] }
		>
			<EmployeeReviewBoard
				employee={ employee }
				payPeriodId={ pay_period_id }
				payPeriodSlug={ pay_period_slug }
				periodDates={ period_dates }
				finalized={ finalized }
				canApprove={ can_approve }
				timesheet={ timesheet }
				shifts={ shifts }
				shiftExceptionReasons={ shift_exception_reasons }
				shiftOtHours={ shift_ot_hours }
				employeeHours={ employee_hours }
				unreviewedShifts={ unreviewed_shifts }
				ihssAssignmentMode={ ihss_assignment_mode }
				canEditIhss={ can_edit_ihss }
			/>
		</Page>
	)
}
