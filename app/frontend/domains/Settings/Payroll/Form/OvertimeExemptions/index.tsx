import { useTranslation } from "react-i18next"

import { Button, Modal } from "@/components"
import { PlusIcon } from "@/components/Icons"
import { FormBand } from "@/features"

import { categoryOptionsFromShiftTypes } from "./criterionUtils"
import { ExemptionFormModalBody } from "./ExemptionFormModalBody"
import { ExemptionsTable } from "./ExemptionsTable"

interface OvertimeExemptionsProps {
	overtime_exemptions: Schema.OvertimeExemption[]
	shift_types: Schema.Category[]
}

export function OvertimeExemptions({ overtime_exemptions, shift_types }: OvertimeExemptionsProps) {
	const { t } = useTranslation()
	const categoryOptions = categoryOptionsFromShiftTypes(shift_types)

	return (
		<FormBand
			title={ t("views.settings.payroll.overtime_exemptions.title") }
			description={ t("views.settings.payroll.overtime_exemptions.description") }
			actions={ (
				<Modal
					title={ t("views.settings.payroll.overtime_exemptions.form_title_create") }
					size="xl"
					trigger={ (
						<Button size="xs" variant="light" leftSection={ <PlusIcon size={ 14 } /> }>
							{ t("views.settings.payroll.overtime_exemptions.add") }
						</Button>
					) }
				>
					<ExemptionFormModalBody categoryOptions={ categoryOptions } />
				</Modal>
			) }
		>
			<ExemptionsTable
				exemptions={ overtime_exemptions }
				categoryOptions={ categoryOptions }
			/>
		</FormBand>
	)
}
