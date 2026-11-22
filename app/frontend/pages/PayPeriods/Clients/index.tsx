import { useTranslation } from "react-i18next"

import { Page } from "@/components"
import { ClientsBoard } from "@/domains/PayPeriods/ClientsBoard"
import { formatter, Routes } from "@/lib"

interface PayPeriodsClientsProps {
	pay_period: Schema.PayPeriod
	period_dates: [string, string]
	payroll_due_date: string
	finalized: boolean
	can_facilitator_approve: boolean
	can_view_employees: boolean
	summary: {
		total_count: number
		approved_count: number
		pending_count: number
		flagged_count: number
		facilitator_pending_shift_count?: number
	}
	period_clients: Schema.ClientsPersisted[]
	pending_shift_count_by_client: Record<string, number>
	reviewed_shift_count_by_client: Record<string, number>
	total_shift_count_by_client: Record<string, number>
	ihss_hours_by_client?: Record<string, number>
}

export default function PayPeriodsClients({
	pay_period,
	period_dates,
	finalized,
	can_view_employees,
	summary,
	period_clients,
	pending_shift_count_by_client = {},
	reviewed_shift_count_by_client = {},
	total_shift_count_by_client = {},
	ihss_hours_by_client = {},
}: PayPeriodsClientsProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = period_dates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""

	return (
		<Page
			title={ t("views.pay_periods.clients.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
				{ title: periodRange || t("views.pay_periods.show.title"), href: can_view_employees ? Routes.period(pay_period.id) : undefined },
				{ title: t("views.pay_periods.clients.title") },
			] }
		>
			<ClientsBoard
				payPeriodId={ pay_period.id }
				periodDates={ period_dates }
				finalized={ finalized }
				canViewEmployees={ can_view_employees }
				facilitatorPendingShiftCount={ summary.facilitator_pending_shift_count ?? 0 }
				periodClients={ period_clients }
				pendingShiftCountByClient={ pending_shift_count_by_client }
				reviewedShiftCountByClient={ reviewed_shift_count_by_client }
				totalShiftCountByClient={ total_shift_count_by_client }
				ihssHoursByClient={ ihss_hours_by_client }
			/>
		</Page>
	)
}
