import { ActionIcon, Box, Group, Select } from "@mantine/core"

import { TrashIcon } from "@/components/Icons"

import {
	FIELD_TYPES,
	type CriterionCondition,
	type FieldKey,
} from "./criterionUtils"
import { CriterionValueInput } from "./CriterionValueInput"

interface CriterionFieldProps {
	field: FieldKey
	condition: CriterionCondition
	onChange: (value: CriterionCondition) => void
	onRemove: () => void
}

export function CriterionField({ field, condition, onChange, onRemove }: CriterionFieldProps) {
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
				<CriterionValueInput field={ field } condition={ condition } onChange={ onChange } />
			</Box>
			<ActionIcon color="red" variant="subtle" onClick={ onRemove } mt={ 25 }>
				<TrashIcon size={ 16 } />
			</ActionIcon>
		</Group>
	)
}
