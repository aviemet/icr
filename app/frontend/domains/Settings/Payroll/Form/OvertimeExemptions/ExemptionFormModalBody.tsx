import { useModalContext } from "@/components/Modal"

import { type CategoryOption } from "./criterionUtils"
import { ExemptionForm, toFormValues } from "./ExemptionForm"

interface ExemptionFormModalBodyProps {
	exemption?: Schema.OvertimeExemption
	categoryOptions: CategoryOption[]
}

export function ExemptionFormModalBody({
	exemption,
	categoryOptions,
}: ExemptionFormModalBodyProps) {
	const { close, opened } = useModalContext()

	if(!opened) return null

	return (
		<ExemptionForm
			key={ exemption?.id ?? "create" }
			exemption={ exemption }
			initialValue={ exemption ? toFormValues(exemption) : undefined }
			categoryOptions={ categoryOptions }
			onCancel={ close }
		/>
	)
}
