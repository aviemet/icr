import {
	type OvertimeExemptionCriterionField,
	type OvertimeExemptionCriterionValue,
} from "@/types/OvertimeExemptionCriteria"

export const FIELD_OPERATORS: Record<OvertimeExemptionCriterionField, readonly string[]> = {
	category: ["equals", "not_equals", "in"],
	start_time: ["equals", "before", "after", "between"],
	end_time: ["equals", "before", "after", "between"],
	duration: [
		"equals",
		"greater_than",
		"less_than",
		"greater_than_equal",
		"less_than_equal",
		"between",
	],
}

export const OPERATOR_LOCALE_KEYS: Record<string, string> = {
	equals: "equals",
	not_equals: "not_equals",
	in: "in",
	before: "before",
	after: "after",
	between: "between",
	greater_than: "greater_than",
	less_than: "less_than",
	greater_than_equal: "greater_than_equal",
	less_than_equal: "less_than_equal",
}

export function operatorLocaleKey(field: OvertimeExemptionCriterionField, operator: string): string {
	if((field === "start_time" || field === "end_time") && operator === "equals") {
		return "at"
	}

	return OPERATOR_LOCALE_KEYS[operator] ?? operator
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
	return Object.hasOwn(FIELD_OPERATORS, field)
}

export function isCriterionValue(value: unknown): value is OvertimeExemptionCriterionValue {
	if(typeof value === "string" || typeof value === "number") return true
	if(!Array.isArray(value) || value.length === 0) return false
	if(value.every(entry => typeof entry === "string")) return true
	if(value.every(entry => typeof entry === "number")) return true
	return false
}

export function fieldKeys(): OvertimeExemptionCriterionField[] {
	return Object.keys(FIELD_OPERATORS).filter(isFieldKey)
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
