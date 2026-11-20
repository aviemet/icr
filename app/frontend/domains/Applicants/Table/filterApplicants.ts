export type ApplicantStatus = Schema.EmployeesIndex["status"]

export const APPLICANT_STATUSES: ApplicantStatus[] = [
	"applicant",
	"offered",
	"declined",
	"withdrawn",
]

export const DEFAULT_APPLICANT_STATUSES: ApplicantStatus[] = [
	"applicant",
	"offered",
]

export type ApplicantColumnFilters = {
	firstName: string
	lastName: string
	jobTitle: string
	jobTitles: string[]
	statuses: ApplicantStatus[]
}

export const defaultApplicantColumnFilters: ApplicantColumnFilters = {
	firstName: "",
	lastName: "",
	jobTitle: "",
	jobTitles: [],
	statuses: DEFAULT_APPLICANT_STATUSES,
}

export function applicantJobTitleName(employee: Schema.EmployeesIndex) {
	return String(employee.desired_job_title?.name ?? employee.job_title?.name ?? "")
}
