import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Group, Text } from "@/components"
import { EditButton } from "@/components/Button"
import { Form, type SubmitWith } from "@/components/Form"
import { formatter } from "@/lib"

import { ReviewRowFormFields, type ReviewRowFormData } from "./ReviewRowFormFields"

interface ReviewRowTimesProps {
	canEdit: boolean
	startsAt: Date
	endsAt: Date
	initialData: ReviewRowFormData
	reloadHref: string
	submitWith: SubmitWith<ReviewRowFormData>
	onTimesChange: (startTime: string, endTime: string) => void
	onCancelEdit: () => void
}

export function ReviewRowTimes({
	canEdit,
	startsAt,
	endsAt,
	initialData,
	reloadHref,
	submitWith,
	onTimesChange,
	onCancelEdit,
}: ReviewRowTimesProps) {
	const { t } = useTranslation()
	const [editing, setEditing] = useState(false)

	const timeRangeLabel = `${formatter.datetime.timeLong(startsAt)} - ${formatter.datetime.timeLong(endsAt)}`

	if(canEdit && editing) {
		return (
			<Form
				method="post"
				action={ reloadHref }
				initialData={ initialData }
				submitWith={ submitWith }
				onBefore={ () => true }
				railsAttributes={ false }
			>
				<ReviewRowFormFields
					initialData={ initialData }
					onTimesChange={ onTimesChange }
					onCancel={ () => {
						onCancelEdit()
						setEditing(false)
					} }
				/>
			</Form>
		)
	}

	return (
		<Group gap={ 6 } wrap="nowrap" align="center">
			<Text size="sm">{ timeRangeLabel }</Text>
			{ canEdit && (
				<EditButton
					label={ t("views.timesheets.employee_review.times") }
					tooltipPosition="top"
					onClick={ () => setEditing(true) }
				/>
			) }
		</Group>
	)
}
