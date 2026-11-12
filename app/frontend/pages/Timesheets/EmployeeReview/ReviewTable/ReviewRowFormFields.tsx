import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Group } from "@/components"
import { Submit, useFormField, useSlotProps } from "@/components/Form"
import { TimeInput } from "@/components/Inputs"

export type ReviewRowFormData = { start_time: string, end_time: string }

interface ReviewRowFormFieldsProps {
	initialData: ReviewRowFormData
	onTimesChange: (startTime: string, endTime: string) => void
}

export function ReviewRowFormFields({ initialData, onTimesChange }: ReviewRowFormFieldsProps) {
	const { t } = useTranslation()

	const [startTime, setStartTime] = useFormField("start_time")
	const [endTime, setEndTime] = useFormField("end_time")
	const slotProps = useSlotProps()

	const startStr = startTime !== undefined && startTime !== null ? String(startTime) : ""
	const endStr = endTime !== undefined && endTime !== null ? String(endTime) : ""
	const isDirty = startStr !== initialData.start_time || endStr !== initialData.end_time

	useEffect(() => {
		if(startStr || endStr) onTimesChange(startStr, endStr)
	}, [startStr, endStr, onTimesChange])

	return (
		<Group gap="xs" wrap="nowrap">
			<TimeInput
				name="start_time"
				value={ startStr }
				onChange={ (value: string) => setStartTime(value || "") }
				disabled={ slotProps?.processing }
				wrapper={ false }
				label=""
			/>
			&#8212;
			<TimeInput
				name="end_time"
				value={ endStr }
				onChange={ (value: string) => setEndTime(value || "") }
				disabled={ slotProps?.processing }
				wrapper={ false }
				label=""
			/>
			<Submit size="xs" loading={ slotProps?.processing } disabled={ slotProps?.processing || !isDirty }>
				{ t("views.timesheets.employee_review.save_times") }
			</Submit>
		</Group>
	)
}
