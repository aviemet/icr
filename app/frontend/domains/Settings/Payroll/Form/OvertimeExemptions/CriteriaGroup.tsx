import { Button, Group, Paper, Select, Stack } from "@mantine/core"
import { useTranslation } from "react-i18next"

import {
	type OvertimeExemptionCriterionCondition,
	type OvertimeExemptionCriterionField,
	type OvertimeExemptionCriterionGroup,
} from "@/types/OvertimeExemptionCriteria"

import { CriterionField } from "./CriterionField"
import {
	type CategoryOption,
	FIELD_TYPES,
	fieldKeys,
	isFieldKey,
} from "./criterionUtils"

interface CriteriaGroupProps {
	group: OvertimeExemptionCriterionGroup
	categoryOptions: CategoryOption[]
	onUpdate: (group: OvertimeExemptionCriterionGroup) => void
	onRemove: () => void
}

const DEFAULT_CONDITIONS: Record<OvertimeExemptionCriterionField, OvertimeExemptionCriterionCondition> = {
	category: { operator: "equals", value: "" },
	start_time: { operator: "equals", value: "" },
	end_time: { operator: "equals", value: "" },
	duration: { operator: "equals", value: 0 },
}

export function CriteriaGroup({ group, categoryOptions, onUpdate, onRemove }: CriteriaGroupProps) {
	const { t } = useTranslation()

	const addCriterion = (field: OvertimeExemptionCriterionField | null) => {
		if(field === null) return

		onUpdate({
			...group,
			[field]: DEFAULT_CONDITIONS[field],
		})
	}

	const removeCriterion = (field: OvertimeExemptionCriterionField) => {
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
							categoryOptions={ categoryOptions }
							onChange={ (newCondition) => onUpdate({ ...group, [field]: newCondition }) }
							onRemove={ () => removeCriterion(field) }
						/>
					)
				}) }

				{ unusedFields.length > 0 && (
					<Group>
						<Select
							placeholder={ t("views.settings.payroll.overtime_exemptions.add_criterion") }
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
					{ t("views.settings.payroll.overtime_exemptions.remove_group") }
				</Button>
			</Group>
		</Paper>
	)
}
