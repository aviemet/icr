import { ActionIcon, Box, Group, Select } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { TrashIcon } from "@/components/Icons"
import {
	type OvertimeExemptionCriterionCondition,
	type OvertimeExemptionCriterionField,
} from "@/types/OvertimeExemptionCriteria"

import {
	type CategoryOption,
	FIELD_OPERATORS,
	operatorLocaleKey,
} from "./criterionUtils"
import { CriterionValueInput } from "./CriterionValueInput"

interface CriterionFieldProps {
	field: OvertimeExemptionCriterionField
	condition: OvertimeExemptionCriterionCondition
	categoryOptions: CategoryOption[]
	onChange: (value: OvertimeExemptionCriterionCondition) => void
	onRemove: () => void
}

export function CriterionField({
	field,
	condition,
	categoryOptions,
	onChange,
	onRemove,
}: CriterionFieldProps) {
	const { t } = useTranslation()
	const operators = FIELD_OPERATORS[field]

	return (
		<Group align="flex-start">
			<Select
				label={ t(`views.settings.payroll.overtime_exemptions.fields.${field}`) }
				data={ operators.map(operator => ({
					value: operator,
					label: t(`views.settings.payroll.overtime_exemptions.operators.${operatorLocaleKey(field, operator)}`),
				})) }
				value={ condition.operator }
				onChange={ (value) => onChange({ ...condition, operator: value || "" }) }
				style={ { width: 200 } }
			/>
			<Box mt={ 25 }>
				<CriterionValueInput
					field={ field }
					condition={ condition }
					categoryOptions={ categoryOptions }
					onChange={ onChange }
				/>
			</Box>
			<ActionIcon color="red" variant="subtle" onClick={ onRemove } mt={ 25 }>
				<TrashIcon size={ 16 } />
			</ActionIcon>
		</Group>
	)
}
