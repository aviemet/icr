import { Button, Text, Title } from "@/components"
import { useFormField } from "@/components/Form"
import { PlusIcon } from "@/components/Icons"

import { CriteriaGroup, type CriterionGroup } from "./CriteriaGroup"

function criteriaFromField(value: unknown): CriterionGroup[] {
	if(!Array.isArray(value)) return [{}]
	return value
}

export function CriteriaGroupsEditor() {
	const [criteriaField, setCriteriaField] = useFormField("overtime_exemption.criteria")
	const criteria = criteriaFromField(criteriaField)

	const setCriteria = (nextCriteria: CriterionGroup[]) => {
		setCriteriaField(nextCriteria)
	}

	const addGroup = () => {
		setCriteria([...criteria, {}])
	}

	const updateGroup = (index: number, group: CriterionGroup) => {
		const nextCriteria = [...criteria]
		nextCriteria[index] = group
		setCriteria(nextCriteria)
	}

	const removeGroup = (index: number) => {
		setCriteria(criteria.filter((_group, groupIndex) => groupIndex !== index))
	}

	return (
		<>
			<Title order={ 3 }>Criteria Groups</Title>
			<Text size="sm" c="dimmed">
				Shifts matching ANY of these criteria groups will be exempt from overtime
			</Text>

			{ criteria.map((group, index) => (
				<CriteriaGroup
					key={ index }
					group={ group }
					onUpdate={ (nextGroup) => updateGroup(index, nextGroup) }
					onRemove={ () => removeGroup(index) }
				/>
			)) }

			<Button
				variant="outline"
				leftSection={ <PlusIcon size={ 16 } /> }
				onClick={ addGroup }
			>
				Add Criteria Group
			</Button>
		</>
	)
}
