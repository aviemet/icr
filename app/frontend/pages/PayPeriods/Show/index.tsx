import { useTranslation } from "react-i18next"

import { Page } from "@/components"
import { PeriodShowBoard, type PeriodShowBoardProps } from "@/domains/PayPeriods/PeriodShowBoard"
import { formatter, Routes } from "@/lib"

export default function PayPeriodsShow(props: PeriodShowBoardProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = props.period_dates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""

	return (
		<Page
			title={ t("views.pay_periods.show.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
				{ title: periodRange || t("views.pay_periods.show.title") },
			] }
		>
			<PeriodShowBoard { ...props } />
		</Page>
	)
}
