import {
	emptyDateRangeFilterValue,
	type DateRangeFilterValue,
} from "@/components/Table/Filters"

export type EmployeeStatus = Schema.EmployeesIndex["status"]

export const EMPLOYEE_STATUSES: EmployeeStatus[] = [
	"employed",
	"terminated",
]

export type EmployeeColumnFilters = {
	firstName: string
	lastName: string
	jobTitle: string
	jobTitles: string[]
	hireDate: DateRangeFilterValue
	number: string
}

export const emptyEmployeeColumnFilters: EmployeeColumnFilters = {
	firstName: "",
	lastName: "",
	jobTitle: "",
	jobTitles: [],
	hireDate: { ...emptyDateRangeFilterValue },
	number: "",
}

export function employeeJobTitleName(employee: Schema.EmployeesIndex) {
	return String(employee.job_title?.name ?? "")
}
