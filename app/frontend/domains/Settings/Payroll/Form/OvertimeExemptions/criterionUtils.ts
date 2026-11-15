export interface CriterionCondition {
	operator: string
	value: string | number | string[] | number[]
}

export const FIELD_TYPES = {
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

export type FieldKey = keyof typeof FIELD_TYPES

export const CATEGORY_OPTIONS = [
	{ value: "sleep_shift", label: "Sleep Shift" },
	{ value: "standby", label: "Standby" },
	{ value: "regular", label: "Regular" },
]

export function isFieldKey(field: string): field is FieldKey {
	return Object.hasOwn(FIELD_TYPES, field)
}

export function fieldKeys(): FieldKey[] {
	return Object.keys(FIELD_TYPES).filter(isFieldKey)
}

export function toNumber(value: string | number): number {
	if(typeof value === "number") return value
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : 0
}

export function stringPair(value: CriterionCondition["value"]): [string, string] {
	if(Array.isArray(value)) {
		return [String(value[0] ?? ""), String(value[1] ?? "")]
	}
	return ["", ""]
}

export function numberPair(value: CriterionCondition["value"]): [number, number] {
	if(Array.isArray(value)) {
		return [toNumber(value[0] ?? 0), toNumber(value[1] ?? 0)]
	}
	return [0, 0]
}
