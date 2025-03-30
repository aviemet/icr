import {
	TextInput,
	Button,
	Paper,
	Stack,
	Group,
	Select,
	NumberInput,
	Box,
	Title,
	ActionIcon,
	Switch,
	Text,
} from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import React, { useState } from "react"

import { PlusIcon, TrashIcon } from "@/Components/Icons"

interface CriterionCondition {
	operator: string
	value: string | number | string[]
}

interface CriterionGroup {
	category?: { operator: string, value: string }
	start_time?: { operator: string, value: string | string[] }
	end_time?: { operator: string, value: string | string[] }
	duration?: { operator: string, value: number }
}

interface OvertimeExemption {
	name: string
	active: boolean
	criteria: CriterionGroup[]
}

const FIELD_TYPES = {
	category: {
		label: "Category",
		operators: [
			{ value: "equals", label: "Equals" },
			{ value: "not_equals", label: "Does not equal" },
			{ value: "in", label: "In list" },
		],
	},
	start_time: {
		label: "Start Time",
		operators: [
			{ value: "equals", label: "At" },
			{ value: "before", label: "Before" },
			{ value: "after", label: "After" },
			{ value: "between", label: "Between" },
		],
	},
	end_time: {
		label: "End Time",
		operators: [
			{ value: "equals", label: "At" },
			{ value: "before", label: "Before" },
			{ value: "after", label: "After" },
			{ value: "between", label: "Between" },
		],
	},
	duration: {
		label: "Duration (hours)",
		operators: [
			{ value: "equals", label: "Equals" },
			{ value: "greater_than", label: "Greater than" },
			{ value: "less_than", label: "Less than" },
			{ value: "greater_than_equal", label: "Greater than or equal" },
			{ value: "less_than_equal", label: "Less than or equal" },
			{ value: "between", label: "Between" },
		],
	},
} as const

const CATEGORY_OPTIONS = [
	{ value: "sleep_shift", label: "Sleep Shift" },
	{ value: "standby", label: "Standby" },
	{ value: "regular", label: "Regular" },
]

const CriterionField: React.FC<{
	field: keyof typeof FIELD_TYPES
	condition: CriterionCondition
	onChange: (value: CriterionCondition) => void
	onRemove: () => void
}> = ({ field, condition, onChange, onRemove }) => {
	const fieldConfig = FIELD_TYPES[field]

	const renderValueInput = () => {
		switch(field) {
			case "category":
				return condition.operator === "in"
					? (
						<Select
							data={ CATEGORY_OPTIONS }
							value={ condition.value as string }
							onChange={ (value) => onChange({ ...condition, value: value || "" }) }
							searchable
							clearable
							multiple
						/>
					)
					: (
						<Select
							data={ CATEGORY_OPTIONS }
							value={ condition.value as string }
							onChange={ (value) => onChange({ ...condition, value: value || "" }) }
							searchable
							clearable
						/>
					)

			case "start_time":
			case "end_time":
				return condition.operator === "between"
					? (
						<Group>
							<TimeInput
								value={ Array.isArray(condition.value) ? condition.value[0] : "" }
								onChange={ (event) => {
									const newValue = Array.isArray(condition.value)
										?
										[event.currentTarget.value, condition.value[1]]
										:
										[event.currentTarget.value, ""]
									onChange({ ...condition, value: newValue })
								} }
							/>
							<TimeInput
								value={ Array.isArray(condition.value) ? condition.value[1] : "" }
								onChange={ (event) => {
									const newValue = Array.isArray(condition.value)
										?
										[condition.value[0], event.currentTarget.value]
										:
										["", event.currentTarget.value]
									onChange({ ...condition, value: newValue })
								} }
							/>
						</Group>
					)
					: (
						<TimeInput
							value={ condition.value as string }
							onChange={ (event) => onChange({ ...condition, value: event.currentTarget.value }) }
						/>
					)

			case "duration":
				return condition.operator === "between"
					? (
						<Group>
							<NumberInput
								value={ Array.isArray(condition.value) ? condition.value[0] : 0 }
								onChange={ (value) => {
									const newValue = [...(Array.isArray(condition.value) ? condition.value : [0, 0])]
									newValue[0] = value || 0
									onChange({ ...condition, value: newValue })
								} }
								min={ 0 }
								max={ 24 }
							/>
							<NumberInput
								value={ Array.isArray(condition.value) ? condition.value[1] : 0 }
								onChange={ (value) => {
									const newValue = [...(Array.isArray(condition.value) ? condition.value : [0, 0])]
									newValue[1] = value || 0
									onChange({ ...condition, value: newValue })
								} }
								min={ 0 }
								max={ 24 }
							/>
						</Group>
					)
					: (
						<NumberInput
							value={ condition.value as number }
							onChange={ (value) => onChange({ ...condition, value: value || 0 }) }
							min={ 0 }
							max={ 24 }
						/>
					)

			default:
				return null
		}
	}

	return (
		<Group align="flex-start">
			<Select
				label={ fieldConfig.label }
				data={ fieldConfig.operators }
				value={ condition.operator }
				onChange={ (value) => onChange({ ...condition, operator: value || "" }) }
				style={ { width: 200 } }
			/>
			<Box mt={ 25 }>{ renderValueInput() }</Box>
			<ActionIcon color="red" variant="subtle" onClick={ onRemove } mt={ 25 }>
				<TrashIcon size={ 16 } />
			</ActionIcon>
		</Group>
	)
}

const CriteriaGroup: React.FC<{
	group: CriterionGroup
	onUpdate: (group: CriterionGroup) => void
	onRemove: () => void
}> = ({ group, onUpdate, onRemove }) => {
	const addCriterion = (field: keyof typeof FIELD_TYPES) => {
		const defaultValues = {
			category: { operator: "equals", value: "" },
			start_time: { operator: "equals", value: "" },
			end_time: { operator: "equals", value: "" },
			duration: { operator: "equals", value: 0 },
		}

		onUpdate({
			...group,
			[field]: defaultValues[field],
		})
	}

	const removeCriterion = (field: keyof typeof FIELD_TYPES) => {
		const newGroup = { ...group }
		delete newGroup[field]
		onUpdate(newGroup)
	}

	const unusedFields = Object.keys(FIELD_TYPES).filter(field => !(field in group))

	return (
		<Paper p="md" withBorder>
			<Stack>
				{ Object.entries(group).map(([field, condition]) => (
					<CriterionField
						key={ field }
						field={ field }
						condition={ condition }
						onChange={ (newCondition) => onUpdate({ ...group, [field]: newCondition }) }
						onRemove={ () => removeCriterion(field) }
					/>
				)) }

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

const OvertimeExemptionForm: React.FC<{
	onSubmit?: (exemption: OvertimeExemption) => void
	initialValue?: OvertimeExemption
}> = ({ onSubmit, initialValue }) => {
	const [exemption, setExemption] = useState<OvertimeExemption>(
		initialValue || {
			name: "",
			active: true,
			criteria: [{}],
		}
	)

	const addGroup = () => {
		setExemption({
			...exemption,
			criteria: [...exemption.criteria, {}],
		})
	}

	const updateGroup = (index: number, group: CriterionGroup) => {
		const newCriteria = [...exemption.criteria]
		newCriteria[index] = group
		setExemption({ ...exemption, criteria: newCriteria })
	}

	const removeGroup = (index: number) => {
		const newCriteria = exemption.criteria.filter((_, i) => i !== index)
		setExemption({ ...exemption, criteria: newCriteria })
	}

	return (
		<form onSubmit={ (e) => {
			e.preventDefault()
			onSubmit(exemption)
		} }>
			<Stack>
				<Title order={ 2 }>Overtime Exemption</Title>

				<Group>
					<TextInput
						label="Name"
						required
						value={ exemption.name }
						onChange={ (e) => setExemption({ ...exemption, name: e.target.value }) }
						style={ { flex: 1 } }
					/>
					<Switch
						label="Active"
						checked={ exemption.active }
						onChange={ (e) => setExemption({ ...exemption, active: e.currentTarget.checked }) }
						mt={ 25 }
					/>
				</Group>

				<Title order={ 3 }>Criteria Groups</Title>
				<Text size="sm" c="dimmed">
					Shifts matching ANY of these criteria groups will be exempt from overtime
				</Text>

				{ exemption.criteria.map((group, index) => (
					<CriteriaGroup
						key={ index }
						group={ group }
						onUpdate={ (newGroup) => updateGroup(index, newGroup) }
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

				<Group>
					<Button type="submit">Save Exemption</Button>
				</Group>
			</Stack>
		</form>
	)
}

export default OvertimeExemptionForm
