import { ActionIcon } from "@mantine/core"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Group, Tooltip } from "@/components"
import { useFormField, useSlotProps } from "@/components/Form"
import { CheckIcon, CrossIcon } from "@/components/Icons"
import { TimeInput } from "@/components/Inputs"

export type ReviewRowFormData = { start_time: string, end_time: string }

interface ReviewRowFormFieldsProps {
	initialData: ReviewRowFormData
	onTimesChange: (startTime: string, endTime: string) => void
	onCancel: () => void
}

export function ReviewRowFormFields({ initialData, onTimesChange, onCancel }: ReviewRowFormFieldsProps) {
	const { t } = useTranslation()

	const [startTime, setStartTime] = useFormField("start_time")
	const [endTime, setEndTime] = useFormField("end_time")
	const slotProps = useSlotProps()

	const startStr = startTime !== undefined && startTime !== null ? String(startTime) : ""
	const endStr = endTime !== undefined && endTime !== null ? String(endTime) : ""
	const fieldsReady = startTime !== undefined && endTime !== undefined
	const isDirty = fieldsReady && (
		startStr !== initialData.start_time || endStr !== initialData.end_time
	)
	const saveLabel = t("views.timesheets.employee_review.save_times")
	const cancelLabel = t("views.timesheets.employee_review.cancel_edit_times")

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
				minutesStep={ 1 }
			/>
			-
			<TimeInput
				name="end_time"
				value={ endStr }
				onChange={ (value: string) => setEndTime(value || "") }
				disabled={ slotProps?.processing }
				wrapper={ false }
				label=""
				minutesStep={ 1 }
			/>
			{ isDirty && (
				<Tooltip label={ saveLabel } withArrow>
					<ActionIcon
						type="submit"
						size="sm"
						variant="filled"
						color="green"
						aria-label={ saveLabel }
						loading={ slotProps?.processing }
						disabled={ slotProps?.processing }
					>
						<CheckIcon size={ 14 } />
					</ActionIcon>
				</Tooltip>
			) }
			<Tooltip label={ cancelLabel } withArrow>
				<ActionIcon
					size="sm"
					variant="light"
					color="gray"
					aria-label={ cancelLabel }
					disabled={ slotProps?.processing }
					onClick={ onCancel }
				>
					<CrossIcon size={ 14 } />
				</ActionIcon>
			</Tooltip>
		</Group>
	)
}
