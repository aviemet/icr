export type RequirementItemFulfillment = {
	fulfillable_id?: string | null
	fulfillable_type?: string | null
	credential_type?: string | null
	kind: "training" | "credential"
	name: string
	status: "met" | "unmet"
}

export type RequirementFulfillment = {
	requirement_id: string
	name: string
	type_name?: string | null
	scope_label: string
	enforcement?: string
	status: "met" | "unmet"
	items: RequirementItemFulfillment[]
}

export type RequirementFulfillmentsPayload = {
	requirements: RequirementFulfillment[]
	met_count: number
	unmet_count: number
	total_count: number
}
