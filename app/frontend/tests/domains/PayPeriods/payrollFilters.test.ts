import { describe, expect, it } from "vitest"

import {
	filterEmployeesForTab,
	parsePayrollIndexTab,
	payrollApprovalStatus,
} from "@/domains/PayPeriods/payrollFilters"

describe("parsePayrollIndexTab", () => {
	it("accepts known tab values", () => {
		expect(parsePayrollIndexTab("needs_approval")).toBe("needs_approval")
		expect(parsePayrollIndexTab("flagged")).toBe("flagged")
		expect(parsePayrollIndexTab("approved")).toBe("approved")
		expect(parsePayrollIndexTab("all")).toBe("all")
	})

	it("rejects unknown tab values", () => {
		expect(parsePayrollIndexTab("unknown")).toBeUndefined()
		expect(parsePayrollIndexTab(null)).toBeUndefined()
	})
})

describe("payrollApprovalStatus", () => {
	it("returns approved when an approval timestamp is present", () => {
		expect(payrollApprovalStatus("2024-03-20")).toBe("approved")
	})

	it("returns pending when approval timestamp is missing", () => {
		expect(payrollApprovalStatus(undefined)).toBe("pending")
	})
})

describe("filterEmployeesForTab", () => {
	const employees = [
		{ id: "1", name: "Approved" },
		{ id: "2", name: "Pending" },
		{ id: "3", name: "Flagged" },
	]
	const approvedAtByEmployee = {
		"1": "2024-03-20",
	}
	const employeeExceptions = {
		"3": { exception_count: 2 },
	}

	it("returns every employee for the all tab", () => {
		expect(filterEmployeesForTab(employees, "all", approvedAtByEmployee, employeeExceptions)).toEqual(employees)
	})

	it("returns approved employees for the approved tab", () => {
		expect(filterEmployeesForTab(employees, "approved", approvedAtByEmployee, employeeExceptions)).toEqual([
			employees[0],
		])
	})

	it("returns pending employees for the needs_approval tab", () => {
		expect(filterEmployeesForTab(employees, "needs_approval", approvedAtByEmployee, employeeExceptions)).toEqual([
			employees[1],
			employees[2],
		])
	})

	it("returns employees with exceptions for the flagged tab", () => {
		expect(filterEmployeesForTab(employees, "flagged", approvedAtByEmployee, employeeExceptions)).toEqual([
			employees[2],
		])
	})
})
