export type OvertimeExemptionCriterionValue = string | number | string[] | number[]

export interface OvertimeExemptionCriterionCondition {
	operator: string
	value: OvertimeExemptionCriterionValue
}

export type OvertimeExemptionCriterionField = "category" | "start_time" | "end_time" | "duration"

export type OvertimeExemptionCriterionGroup = {
	[Field in OvertimeExemptionCriterionField]?: OvertimeExemptionCriterionCondition
}

export type OvertimeExemptionCriteria = OvertimeExemptionCriterionGroup[]
