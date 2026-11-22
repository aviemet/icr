import { type ServerTableFilterField, type ServerTableFilterValues } from "@/components/Table/serverTableFilters"

export const trainingServerFilterFields: ServerTableFilterField[] = [
	{ param: "client_ids", kind: "multi" },
]

export const trainingServerFilterOnly = [
	"trainings",
	"pagination",
	"client_options",
]

export function trainingFiltersFromServerValues(values: ServerTableFilterValues) {
	const clientIdsValue = values.client_ids

	return {
		clientIds: Array.isArray(clientIdsValue) ? clientIdsValue : [],
	}
}
