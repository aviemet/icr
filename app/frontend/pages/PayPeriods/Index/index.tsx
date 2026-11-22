import { useTranslation } from "react-i18next"

import { Page } from "@/components"
import { PayrollHomeBoard, type PayrollHomeBoardProps } from "@/domains/PayPeriods/PayrollHomeBoard"
import { Routes } from "@/lib"

interface PayPeriodsIndexProps extends PayrollHomeBoardProps {
	current_period: Schema.PayPeriod
}

export default function PayPeriodsIndex({
	current_summary,
	can_finalize,
	can_export,
	periods,
}: PayPeriodsIndexProps) {
	const { t } = useTranslation()

	return (
		<Page
			title={ t("views.pay_periods.index.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
			] }
		>
			<PayrollHomeBoard
				current_summary={ current_summary }
				can_finalize={ can_finalize }
				can_export={ can_export }
				periods={ periods }
			/>
		</Page>
	)
}
