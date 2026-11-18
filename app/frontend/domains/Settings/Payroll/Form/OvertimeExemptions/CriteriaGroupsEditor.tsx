import { useTranslation } from "react-i18next"

import { Button, Text, Title } from "@/components"
import { useFormField } from "@/components/Form"
import { PlusIcon } from "@/components/Icons"
import {
	type OvertimeExemptionCriteria,
	type OvertimeExemptionCriterionGroup,
} from "@/types/OvertimeExemptionCriteria"

import { CriteriaGroup } from "./CriteriaGroup"
import { type CategoryOption, isCriterionValue, isFieldKey } from "./criterionUtils"

function criteriaFromField(value: unknown): OvertimeExemptionCriteria {
	if(!Array.isArray(value)) return [{}]

	return value.map(group => {
		if(typeof group !== "object" || group === null || Array.isArray(group)) return {}

		const nextGroup: OvertimeExemptionCriterionGroup = {}
		for(const [field, condition] of Object.entries(group)) {
			if(!isFieldKey(field)) continue
			if(typeof condition !== "object" || condition === null || Array.isArray(condition)) continue
			if(!("operator" in condition) || !("value" in condition)) continue
			if(typeof condition.operator !== "string") continue
			if(!isCriterionValue(condition.value)) continue

			nextGroup[field] = {
				operator: condition.operator,
				value: condition.value,
			}
		}
		return nextGroup
	})
}

interface CriteriaGroupsEditorProps {
	categoryOptions: CategoryOption[]
}

export function CriteriaGroupsEditor({ categoryOptions }: CriteriaGroupsEditorProps) {
	const { t } = useTranslation()
	const [criteriaField, setCriteriaField] = useFormField("overtime_exemption.criteria")
	const criteria = criteriaFromField(criteriaField)

	const setCriteria = (nextCriteria: OvertimeExemptionCriteria) => {
		setCriteriaField(nextCriteria)
	}

	const addGroup = () => {
		setCriteria([...criteria, {}])
	}

	const updateGroup = (index: number, group: OvertimeExemptionCriterionGroup) => {
		const nextCriteria = [...criteria]
		nextCriteria[index] = group
		setCriteria(nextCriteria)
	}

	const removeGroup = (index: number) => {
		setCriteria(criteria.filter((_group, groupIndex) => groupIndex !== index))
	}

	return (
		<>
			<Title order={ 5 }>
				{ t("views.settings.payroll.overtime_exemptions.criteria_groups") }
			</Title>
			<Text size="sm" c="dimmed">
				{ t("views.settings.payroll.overtime_exemptions.criteria_groups_help") }
			</Text>

			{ criteria.map((group, index) => (
				<CriteriaGroup
					key={ index }
					group={ group }
					categoryOptions={ categoryOptions }
					onUpdate={ (nextGroup) => updateGroup(index, nextGroup) }
					onRemove={ () => removeGroup(index) }
				/>
			)) }

			<Button
				variant="outline"
				leftSection={ <PlusIcon size={ 16 } /> }
				onClick={ addGroup }
			>
				{ t("views.settings.payroll.overtime_exemptions.add_criteria_group") }
			</Button>
		</>
	)
}
