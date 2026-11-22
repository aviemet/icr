import { useTranslation } from "react-i18next"

import { Button, Group, Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Switch, TextInput } from "@/components/Inputs"
import { Routes, type HTTPVerb } from "@/lib"
import {
	type OvertimeExemptionCriteria,
	type OvertimeExemptionCriterionGroup,
} from "@/types/OvertimeExemptionCriteria"

import { CriteriaGroupsEditor } from "./CriteriaGroupsEditor"
import { type CategoryOption, isFieldKey } from "./criterionUtils"

export type OvertimeExemptionFormValues = {
	name: string
	active: boolean
	criteria: OvertimeExemptionCriteria
}

type OvertimeExemptionFormData = {
	overtime_exemption: OvertimeExemptionFormValues
}

interface ExemptionFormProps {
	exemption?: Schema.OvertimeExemption
	initialValue?: OvertimeExemptionFormValues
	categoryOptions: CategoryOption[]
	onCancel: () => void
}

function emptyExemption(): OvertimeExemptionFormValues {
	return {
		name: "",
		active: true,
		criteria: [{}],
	}
}

function toCriterionGroup(group: OvertimeExemptionCriterionGroup): OvertimeExemptionCriterionGroup {
	const nextGroup: OvertimeExemptionCriterionGroup = {}
	for(const [field, condition] of Object.entries(group)) {
		if(isFieldKey(field) && condition) {
			nextGroup[field] = {
				operator: condition.operator,
				value: condition.value,
			}
		}
	}
	return nextGroup
}

export function toFormValues(exemption: Schema.OvertimeExemption): OvertimeExemptionFormValues {
	const criteria = exemption.criteria.map(toCriterionGroup)
	return {
		name: exemption.name,
		active: exemption.active,
		criteria: criteria.length > 0 ? criteria : [{}],
	}
}

export function ExemptionForm({
	exemption,
	initialValue,
	categoryOptions,
	onCancel,
}: ExemptionFormProps) {
	const { t } = useTranslation()
	const isEdit = exemption !== undefined
	const action = isEdit
		? Routes.settingsOvertimeExemption(exemption.id)
		: Routes.settingsOvertimeExemptions()
	const method: HTTPVerb = isEdit ? "patch" : "post"

	const initialData: OvertimeExemptionFormData = {
		overtime_exemption: initialValue || (isEdit ? toFormValues(exemption) : emptyExemption()),
	}

	return (
		<Form<OvertimeExemptionFormData>
			action={ action }
			method={ method }
			initialData={ initialData }
			railsAttributes={ false }
		>
			<Stack>
				<Group>
					<TextInput
						name="overtime_exemption.name"
						label={ t("views.settings.payroll.overtime_exemptions.name") }
						required
						style={ { flex: 1 } }
					/>
					<Switch
						name="overtime_exemption.active"
						label={ t("views.settings.payroll.overtime_exemptions.active") }
						mt={ 25 }
					/>
				</Group>

				<CriteriaGroupsEditor categoryOptions={ categoryOptions } />

				<Group>
					<Submit>
						{ isEdit
							? t("views.settings.payroll.overtime_exemptions.save_update")
							: t("views.settings.payroll.overtime_exemptions.save_create") }
					</Submit>
					<Button variant="subtle" onClick={ onCancel }>
						{ t("views.settings.payroll.overtime_exemptions.cancel") }
					</Button>
				</Group>
			</Stack>
		</Form>
	)
}
