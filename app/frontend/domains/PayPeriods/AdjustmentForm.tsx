import { router } from "@inertiajs/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button, Stack } from "@/components"
import { TextInput } from "@/components/Inputs"
import { Routes } from "@/lib"

interface AdjustmentFormProps {
	payPeriodId: string
}

export function AdjustmentForm({ payPeriodId }: AdjustmentFormProps) {
	const { t } = useTranslation()
	const [reason, setReason] = useState("")
	const [timesheetId, setTimesheetId] = useState("")
	const [approvedAt, setApprovedAt] = useState("")
	const [processing, setProcessing] = useState(false)

	const handleSubmit = () => {
		if(!reason.trim()) return

		setProcessing(true)
		router.post(
			Routes.adjustmentsPeriod(payPeriodId),
			{
				reason,
				timesheet_id: timesheetId || undefined,
				change_set: {
					approved_at: approvedAt,
				},
			},
			{
				onFinish: () => setProcessing(false),
			},
		)
	}

	return (
		<Stack gap="sm" maw={ 480 }>
			<TextInput
				label={ t("views.pay_periods.show.adjustment_reason") }
				value={ reason }
				onChange={ event => setReason(event.currentTarget.value) }
				required
			/>
			<TextInput
				label={ t("views.pay_periods.show.adjustment_timesheet_id") }
				value={ timesheetId }
				onChange={ event => setTimesheetId(event.currentTarget.value) }
			/>
			<TextInput
				label={ t("views.pay_periods.show.adjustment_approved_at") }
				value={ approvedAt }
				onChange={ event => setApprovedAt(event.currentTarget.value) }
			/>
			<Button onClick={ handleSubmit } loading={ processing } disabled={ !reason.trim() }>
				{ t("views.pay_periods.show.adjustment_submit") }
			</Button>
		</Stack>
	)
}
