export type PayrollIndexTab = "all" | "needs_approval" | "flagged" | "approved"

export type PayrollApprovalStatus = "pending" | "approved"

const PAYROLL_INDEX_TABS: readonly PayrollIndexTab[] = ["all", "needs_approval", "flagged", "approved"]

export function parsePayrollIndexTab(value: string | null | undefined): PayrollIndexTab | undefined {
	if(!value) return undefined

	return PAYROLL_INDEX_TABS.find(tab => tab === value)
}

interface FilterableEmployee {
	id: string
}

interface EmployeeExceptionsMap {
	exception_count?: number
}

export function payrollApprovalStatus(approvedAt: string | undefined): PayrollApprovalStatus {
	if(approvedAt) {
		return "approved"
	}

	return "pending"
}

export function filterEmployeesForTab<T extends FilterableEmployee>(
	employees: T[],
	tab: PayrollIndexTab,
	approvedAtByEmployee: Record<string, string>,
	employeeExceptions: Record<string, EmployeeExceptionsMap>,
) {
	if(tab === "all") {
		return employees
	}

	if(tab === "approved") {
		return employees.filter(employee => payrollApprovalStatus(approvedAtByEmployee[employee.id]) === "approved")
	}

	if(tab === "needs_approval") {
		return employees.filter(employee => payrollApprovalStatus(approvedAtByEmployee[employee.id]) === "pending")
	}

	return employees.filter(employee => (employeeExceptions[employee.id]?.exception_count ?? 0) > 0)
}
