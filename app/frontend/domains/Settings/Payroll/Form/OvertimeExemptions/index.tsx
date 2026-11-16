import { useState } from "react"

import { Divider, Stack } from "@/components"

import { categoryOptionsFromShiftTypes } from "./criterionUtils"
import { ExemptionForm, toFormValues } from "./ExemptionForm"
import { ExemptionsList } from "./ExemptionsList"

interface OvertimeExemptionsProps {
	overtime_exemptions: Schema.OvertimeExemption[]
	shift_types: Schema.Category[]
}

export function OvertimeExemptions({ overtime_exemptions, shift_types }: OvertimeExemptionsProps) {
	const [editingExemption, setEditingExemption] = useState<Schema.OvertimeExemption>()
	const categoryOptions = categoryOptionsFromShiftTypes(shift_types)

	const clearEdit = () => {
		setEditingExemption(undefined)
	}

	return (
		<Stack gap="lg">
			<ExemptionsList
				exemptions={ overtime_exemptions }
				editingId={ editingExemption?.id }
				onEdit={ setEditingExemption }
			/>

			<Divider />

			{ editingExemption
				? (
					<ExemptionForm
						key={ editingExemption.id }
						exemption={ editingExemption }
						initialValue={ toFormValues(editingExemption) }
						categoryOptions={ categoryOptions }
						onCancelEdit={ clearEdit }
					/>
				)
				: (
					<ExemptionForm key="create" categoryOptions={ categoryOptions } />
				) }
		</Stack>
	)
}
