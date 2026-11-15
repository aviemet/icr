import { Group, MultiSelect, NumberInput, Select } from "@mantine/core"
import { TimeInput } from "@mantine/dates"

import {
	CATEGORY_OPTIONS,
	numberPair,
	stringPair,
	toNumber,
	type CriterionCondition,
	type FieldKey,
} from "./criterionUtils"

interface CriterionValueInputProps {
	field: FieldKey
	condition: CriterionCondition
	onChange: (value: CriterionCondition) => void
}

export function CriterionValueInput({ field, condition, onChange }: CriterionValueInputProps) {
	if(field === "category") {
		if(condition.operator === "in") {
			const selected = Array.isArray(condition.value)
				? condition.value.map(entry => String(entry))
				: []

			return (
				<MultiSelect
					data={ CATEGORY_OPTIONS }
					value={ selected }
					onChange={ (value) => onChange({ ...condition, value }) }
					searchable
					clearable
				/>
			)
		}

		const selected = typeof condition.value === "string" ? condition.value : null

		return (
			<Select
				data={ CATEGORY_OPTIONS }
				value={ selected }
				onChange={ (value) => onChange({ ...condition, value: value || "" }) }
				searchable
				clearable
			/>
		)
	}

	if(field === "start_time" || field === "end_time") {
		if(condition.operator === "between") {
			const [startValue, endValue] = stringPair(condition.value)

			return (
				<Group>
					<TimeInput
						value={ startValue }
						onChange={ (event) => {
							onChange({
								...condition,
								value: [event.currentTarget.value, endValue],
							})
						} }
					/>
					<TimeInput
						value={ endValue }
						onChange={ (event) => {
							onChange({
								...condition,
								value: [startValue, event.currentTarget.value],
							})
						} }
					/>
				</Group>
			)
		}

		const timeValue = typeof condition.value === "string" ? condition.value : ""

		return (
			<TimeInput
				value={ timeValue }
				onChange={ (event) => onChange({ ...condition, value: event.currentTarget.value }) }
			/>
		)
	}

	if(field === "duration") {
		if(condition.operator === "between") {
			const [minValue, maxValue] = numberPair(condition.value)

			return (
				<Group>
					<NumberInput
						value={ minValue }
						onChange={ (value) => {
							onChange({ ...condition, value: [toNumber(value), maxValue] })
						} }
						min={ 0 }
						max={ 24 }
					/>
					<NumberInput
						value={ maxValue }
						onChange={ (value) => {
							onChange({ ...condition, value: [minValue, toNumber(value)] })
						} }
						min={ 0 }
						max={ 24 }
					/>
				</Group>
			)
		}

		let durationValue = 0
		if(typeof condition.value === "number") {
			durationValue = condition.value
		} else if(typeof condition.value === "string") {
			durationValue = toNumber(condition.value)
		}

		return (
			<NumberInput
				value={ durationValue }
				onChange={ (value) => onChange({ ...condition, value: toNumber(value) }) }
				min={ 0 }
				max={ 24 }
			/>
		)
	}

	return null
}
