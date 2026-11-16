import { ActionIcon, Box, Group, Select } from "@mantine/core"

import { TrashIcon } from "@/components/Icons"
import {
	type OvertimeExemptionCriterionCondition,
	type OvertimeExemptionCriterionField,
} from "@/types/OvertimeExemptionCriteria"

import { type CategoryOption, FIELD_TYPES } from "./criterionUtils"
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
	const fieldConfig = FIELD_TYPES[field]

	return (
		<Group align="flex-start">
			<Select
				label={ fieldConfig.label }
				data={ [...fieldConfig.operators] }
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
