import { type ServerTableFilterField, type ServerTableFilterValues } from "@/components/Table/serverTableFilters"

import {
	APPLICANT_STATUSES,
	DEFAULT_APPLICANT_STATUSES,
	defaultApplicantColumnFilters,
	type ApplicantColumnFilters,
	type ApplicantStatus,
} from "./filterApplicants"

export const applicantServerFilterFields: ServerTableFilterField[] = [
	{ param: "first_name", kind: "text" },
	{ param: "last_name", kind: "text" },
	{ param: "job_title", kind: "text" },
	{ param: "job_titles", kind: "multi" },
	{ param: "statuses", kind: "multi", default: DEFAULT_APPLICANT_STATUSES },
]

export const applicantServerFilterOnly = ["employees", "pagination", "job_title_options", "can_updates"]

function isApplicantStatus(value: string): value is ApplicantStatus {
	return APPLICANT_STATUSES.some(status => status === value)
}

export function applicantFiltersFromServerValues(
	values: ServerTableFilterValues,
): ApplicantColumnFilters {
	const statusesValue = values.statuses
	const statuses = Array.isArray(statusesValue)
		? statusesValue.filter(isApplicantStatus)
		: defaultApplicantColumnFilters.statuses

	const jobTitlesValue = values.job_titles

	return {
		firstName: typeof values.first_name === "string" ? values.first_name : "",
		lastName: typeof values.last_name === "string" ? values.last_name : "",
		jobTitle: typeof values.job_title === "string" ? values.job_title : "",
		jobTitles: Array.isArray(jobTitlesValue) ? jobTitlesValue : [],
		statuses,
	}
}
