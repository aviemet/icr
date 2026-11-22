import { useTranslation } from "react-i18next"

import { Page } from "@/components"
import {
	IhssAssignmentBoard,
	type IhssAssignmentRow,
} from "@/domains/PayPeriods/IhssAssignmentBoard"
import { formatter, Routes } from "@/lib"

interface PayPeriodsIhssProps {
	pay_period: Schema.PayPeriod
	period_dates: [string, string]
	finalized: boolean
	assignment_rows: IhssAssignmentRow[]
}

export default function PayPeriodsIhss({
	pay_period,
	period_dates,
	finalized,
	assignment_rows,
}: PayPeriodsIhssProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = period_dates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""

	return (
		<Page
			title={ t("views.pay_periods.ihss.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
				{ title: periodRange || t("views.pay_periods.show.title"), href: Routes.period(pay_period.id) },
				{ title: t("views.pay_periods.ihss.title") },
			] }
		>
			<IhssAssignmentBoard
				payPeriodId={ pay_period.id }
				periodDates={ period_dates }
				finalized={ finalized }
				assignmentRows={ assignment_rows }
			/>
		</Page>
	)
}
