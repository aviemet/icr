export type EmployeeStatus = Schema.EmployeesIndex["status"]

export const EMPLOYEE_STATUSES: EmployeeStatus[] = [
	"applicant",
	"offered",
	"employed",
	"declined",
	"terminated",
]

export type EmployeeColumnFilters = {
	firstName: string
	lastName: string
	jobTitle: string
	jobTitles: string[]
	statuses: EmployeeStatus[]
	hireDate: string
	number: string
}

export const emptyEmployeeColumnFilters: EmployeeColumnFilters = {
	firstName: "",
	lastName: "",
	jobTitle: "",
	jobTitles: [],
	statuses: [],
	hireDate: "",
	number: "",
}

export const defaultEmployeeColumnFilters: EmployeeColumnFilters = {
	...emptyEmployeeColumnFilters,
	statuses: ["employed"],
}

export function employeeJobTitleName(employee: Schema.EmployeesIndex) {
	return String(employee.job_title?.name ?? "")
}
