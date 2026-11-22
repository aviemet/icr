import { useTranslation } from "react-i18next"

import { Page } from "@/components"
import { ClientReviewBoard } from "@/domains/PayPeriods/ClientReviewBoard"
import { type ClientPeriodEmployee } from "@/domains/PayPeriods/clientShiftEmployees"
import { formatter, Routes } from "@/lib"

interface PayPeriodsClientProps {
	pay_period: Schema.PayPeriod
	period_dates: [string, string]
	finalized: boolean
	can_facilitator_approve: boolean
	can_view_employees: boolean
	period_client: Schema.ClientsPersisted
	period_employees: ClientPeriodEmployee[]
	shifts: Schema.ShiftsReview[]
	shift_exception_reasons: Record<string, string[]>
	shift_ot_hours: Record<string, number>
	ihss_hours_used?: number
	ihss_assignment_mode?: string
	can_edit_ihss?: boolean
}

export default function PayPeriodsClient({
	pay_period,
	period_dates,
	finalized,
	can_facilitator_approve,
	can_view_employees,
	period_client,
	period_employees,
	shifts,
	shift_exception_reasons = {},
	shift_ot_hours = {},
	ihss_hours_used = 0,
	ihss_assignment_mode = "shift",
	can_edit_ihss = false,
}: PayPeriodsClientProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = period_dates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const clientName = period_client.full_name ?? period_client.name ?? "-"

	return (
		<Page
			title={ clientName }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
				{ title: periodRange || t("views.pay_periods.show.title"), href: can_view_employees ? Routes.period(pay_period.id) : undefined },
				{ title: t("views.pay_periods.clients.title"), href: Routes.clientsPeriod(pay_period.id) },
				{ title: clientName },
			] }
		>
			<ClientReviewBoard
				payPeriodId={ pay_period.id }
				periodDates={ period_dates }
				finalized={ finalized }
				canFacilitatorApprove={ can_facilitator_approve }
				canViewEmployees={ can_view_employees }
				periodClient={ period_client }
				periodEmployees={ period_employees }
				shifts={ shifts }
				shiftExceptionReasons={ shift_exception_reasons }
				shiftOtHours={ shift_ot_hours }
				ihssHoursUsed={ ihss_hours_used }
				ihssAssignmentMode={ ihss_assignment_mode }
				canEditIhss={ can_edit_ihss }
			/>
		</Page>
	)
}
