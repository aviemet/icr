import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components"
import { Routes } from "@/lib"

interface ReviewStatusCellProps {
	shift: Schema.ShiftsReview
	payPeriodId: string
}

export function ReviewStatusCell({ shift, payPeriodId }: ReviewStatusCellProps) {
	const { t } = useTranslation()
	const reviewed = Boolean(shift.facilitator_approved_at)
	const label = reviewed
		? t("views.pay_periods.client_show.unapprove")
		: t("views.pay_periods.client_show.approve")

	const occurrenceStartsAt = shift.occurrence_starts_at
		? new Date(String(shift.occurrence_starts_at)).toISOString()
		: new Date(String(shift.starts_at)).toISOString()

	return (
		<Button
			size="xs"
			variant={ reviewed ? "default" : "filled" }
			color={ reviewed ? "gray" : "green" }
			onClick={ () => {
				const route = reviewed
					? Routes.unapproveShift(shift.shift_id)
					: Routes.approveShift(shift.shift_id)
				router.post(route, {
					pay_period_id: payPeriodId,
					occurrence_starts_at: occurrenceStartsAt,
				}, {
					preserveState: true,
					preserveScroll: true,
				})
			} }
		>
			{ label }
		</Button>
	)
}
