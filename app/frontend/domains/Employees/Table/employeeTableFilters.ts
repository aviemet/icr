import { type ServerTableFilterField } from "@/components/Table/serverTableFilters"

import {
	defaultEmployeeColumnFilters,
	EMPLOYEE_STATUSES,
	type EmployeeColumnFilters,
	type EmployeeStatus,
} from "./filterEmployees"

export const employeeServerFilterFields: ServerTableFilterField[] = [
	{ param: "first_name", kind: "text" },
	{ param: "last_name", kind: "text" },
	{ param: "job_title", kind: "text" },
	{ param: "job_titles", kind: "multi" },
	{ param: "statuses", kind: "multi", default: ["employed"] },
	{ param: "active_at", kind: "text" },
	{ param: "number", kind: "text" },
]

export const employeeServerFilterOnly = ["employees", "pagination", "job_title_options"]

function isEmployeeStatus(value: string): value is EmployeeStatus {
	return EMPLOYEE_STATUSES.some(status => status === value)
}

export function employeeFiltersFromServerValues(
	values: Record<string, string | string[]>,
): EmployeeColumnFilters {
	const statusesValue = values.statuses
	const statuses = Array.isArray(statusesValue)
		? statusesValue.filter(isEmployeeStatus)
		: defaultEmployeeColumnFilters.statuses

	const jobTitlesValue = values.job_titles

	return {
		firstName: typeof values.first_name === "string" ? values.first_name : "",
		lastName: typeof values.last_name === "string" ? values.last_name : "",
		jobTitle: typeof values.job_title === "string" ? values.job_title : "",
		jobTitles: Array.isArray(jobTitlesValue) ? jobTitlesValue : [],
		statuses,
		hireDate: typeof values.active_at === "string" ? values.active_at : "",
		number: typeof values.number === "string" ? values.number : "",
	}
}
