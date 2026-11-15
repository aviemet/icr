import { Button, Group, Paper, Select, Stack } from "@mantine/core"

import { CriterionField } from "./CriterionField"
import {
	FIELD_TYPES,
	fieldKeys,
	isFieldKey,
	type CriterionCondition,
	type FieldKey,
} from "./criterionUtils"

export interface CriterionGroup {
	category?: CriterionCondition
	start_time?: CriterionCondition
	end_time?: CriterionCondition
	duration?: CriterionCondition
}

interface CriteriaGroupProps {
	group: CriterionGroup
	onUpdate: (group: CriterionGroup) => void
	onRemove: () => void
}

const DEFAULT_CONDITIONS: Record<FieldKey, CriterionCondition> = {
	category: { operator: "equals", value: "" },
	start_time: { operator: "equals", value: "" },
	end_time: { operator: "equals", value: "" },
	duration: { operator: "equals", value: 0 },
}

export function CriteriaGroup({ group, onUpdate, onRemove }: CriteriaGroupProps) {
	const addCriterion = (field: FieldKey | null) => {
		if(field === null) return

		onUpdate({
			...group,
			[field]: DEFAULT_CONDITIONS[field],
		})
	}

	const removeCriterion = (field: FieldKey) => {
		const nextGroup = { ...group }
		delete nextGroup[field]
		onUpdate(nextGroup)
	}

	const activeFields = Object.keys(group).filter(isFieldKey)
	const unusedFields = fieldKeys().filter(field => !(field in group))

	return (
		<Paper p="md" withBorder>
			<Stack>
				{ activeFields.map((field) => {
					const condition = group[field]
					if(!condition) return null

					return (
						<CriterionField
							key={ field }
							field={ field }
							condition={ condition }
							onChange={ (newCondition) => onUpdate({ ...group, [field]: newCondition }) }
							onRemove={ () => removeCriterion(field) }
						/>
					)
				}) }

				{ unusedFields.length > 0 && (
					<Group>
						<Select
							placeholder="Add criterion"
							data={ unusedFields.map(field => ({
								value: field,
								label: FIELD_TYPES[field].label,
							})) }
							onChange={ addCriterion }
							clearable
							style={ { width: 200 } }
						/>
					</Group>
				) }
			</Stack>

			<Group mt="md">
				<Button variant="subtle" color="red" onClick={ onRemove }>
					Remove Group
				</Button>
			</Group>
		</Paper>
	)
}
