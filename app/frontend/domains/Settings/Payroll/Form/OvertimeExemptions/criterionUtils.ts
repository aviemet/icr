import {
	type OvertimeExemptionCriterionField,
	type OvertimeExemptionCriterionValue,
} from "@/types/OvertimeExemptionCriteria"

export const FIELD_TYPES: Record<OvertimeExemptionCriterionField, {
	label: string
	operators: ReadonlyArray<{ value: string, label: string }>
}> = {
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
}

export type CategoryOption = {
	value: string
	label: string
}

export function categoryOptionsFromShiftTypes(shiftTypes: Schema.Category[]): CategoryOption[] {
	return shiftTypes.flatMap(shiftType => {
		const value = shiftType.slug || shiftType.id
		if(!value) return []
		return [{ value, label: shiftType.name }]
	})
}

export function isFieldKey(field: string): field is OvertimeExemptionCriterionField {
	return Object.hasOwn(FIELD_TYPES, field)
}

export function isCriterionValue(value: unknown): value is OvertimeExemptionCriterionValue {
	if(typeof value === "string" || typeof value === "number") return true
	if(!Array.isArray(value) || value.length === 0) return false
	if(value.every(entry => typeof entry === "string")) return true
	if(value.every(entry => typeof entry === "number")) return true
	return false
}

export function fieldKeys(): OvertimeExemptionCriterionField[] {
	return Object.keys(FIELD_TYPES).filter(isFieldKey)
}

export function toNumber(value: string | number): number {
	if(typeof value === "number") return value
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : 0
}

export function stringPair(value: OvertimeExemptionCriterionValue): [string, string] {
	if(Array.isArray(value)) {
		return [String(value[0] ?? ""), String(value[1] ?? "")]
	}
	return ["", ""]
}

export function numberPair(value: OvertimeExemptionCriterionValue): [number, number] {
	if(Array.isArray(value)) {
		return [toNumber(value[0] ?? 0), toNumber(value[1] ?? 0)]
	}
	return [0, 0]
}
