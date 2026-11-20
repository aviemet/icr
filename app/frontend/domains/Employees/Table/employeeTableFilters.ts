import {
	emptyDateRangeFilterValue,
	type DateRangeFilterValue,
} from "@/components/Table/Filters"
import {
	type ServerTableFilterField,
	type ServerTableFilterValues,
} from "@/components/Table/serverTableFilters"

import { type EmployeeColumnFilters } from "./filterEmployees"

export const employeeServerFilterFields: ServerTableFilterField[] = [
	{ param: "first_name", kind: "text" },
	{ param: "last_name", kind: "text" },
	{ param: "job_title", kind: "text" },
	{ param: "job_titles", kind: "multi" },
	{ param: "active_at", kind: "date_range" },
	{ param: "number", kind: "text" },
]

export const employeeServerFilterOnly = [
	"employees",
	"pagination",
	"job_title_options",
	"can_updates",
	"can_scope_employees",
	"workforce_view",
]

function isDateRangeValue(value: string | string[] | DateRangeFilterValue | undefined): value is DateRangeFilterValue {
	return typeof value === "object" && value !== null && !Array.isArray(value) && "start" in value && "end" in value
}

export function employeeFiltersFromServerValues(
	values: ServerTableFilterValues,
): EmployeeColumnFilters {
	const jobTitlesValue = values.job_titles
	const hireDateValue = values.active_at

	return {
		firstName: typeof values.first_name === "string" ? values.first_name : "",
		lastName: typeof values.last_name === "string" ? values.last_name : "",
		jobTitle: typeof values.job_title === "string" ? values.job_title : "",
		jobTitles: Array.isArray(jobTitlesValue) ? jobTitlesValue : [],
		hireDate: isDateRangeValue(hireDateValue)
			? hireDateValue
			: { ...emptyDateRangeFilterValue },
		number: typeof values.number === "string" ? values.number : "",
	}
}
