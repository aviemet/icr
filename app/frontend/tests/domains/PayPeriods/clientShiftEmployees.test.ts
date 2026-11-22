import { describe, expect, it } from "vitest"

import {
	defaultEmployeeId,
	employeeOptionsFromEmployees,
	hoursForShifts,
	shiftsForEmployee,
} from "@/domains/PayPeriods/clientShiftEmployees"

function reviewShift(
	overrides: Partial<Schema.ShiftsReview> & Pick<Schema.ShiftsReview, "id" | "employee_id" | "employee_name">,
): Schema.ShiftsReview {
	return {
		calendar_event_id: "event-1",
		category: { id: "cat-1", name: "Direct", slug: "direct", system: false },
		client_name: "Client",
		client_slug: "client",
		created_at: new Date("2024-03-18T09:00:00Z"),
		ends_at: new Date("2024-03-18T17:00:00Z"),
		ihss: false,
		is_recurring: false,
		shift_id: overrides.id,
		starts_at: new Date("2024-03-18T09:00:00Z"),
		updated_at: new Date("2024-03-18T09:00:00Z"),
		...overrides,
	}
}

describe("employeeOptionsFromEmployees", () => {
	it("returns employees sorted by name", () => {
		const options = employeeOptionsFromEmployees([
			{ id: "b", name: "Blake", slug: "blake" },
			{ id: "a", name: "Ava", slug: "ava" },
		])

		expect(options).toEqual([
			{ value: "a", label: "Ava" },
			{ value: "b", label: "Blake" },
		])
	})
})

describe("defaultEmployeeId", () => {
	it("prefers an employee with pending shifts", () => {
		const shifts = [
			reviewShift({
				id: "1",
				employee_id: "a",
				employee_name: "Ava",
				facilitator_approved_at: new Date("2024-03-19"),
			}),
			reviewShift({
				id: "2",
				employee_id: "b",
				employee_name: "Blake",
			}),
		]
		const options = employeeOptionsFromEmployees([
			{ id: "a", name: "Ava", slug: "ava" },
			{ id: "b", name: "Blake", slug: "blake" },
		])

		expect(defaultEmployeeId(shifts, options)).toBe("b")
	})
})

describe("shiftsForEmployee", () => {
	it("returns only shifts for the selected employee", () => {
		const shifts = [
			reviewShift({ id: "1", employee_id: "a", employee_name: "Ava" }),
			reviewShift({ id: "2", employee_id: "b", employee_name: "Blake" }),
		]

		expect(shiftsForEmployee(shifts, "a").map(shift => shift.id)).toEqual(["1"])
		expect(shiftsForEmployee(shifts, null)).toEqual([])
	})
})

describe("hoursForShifts", () => {
	it("splits regular and overtime hours for the selected shifts", () => {
		const shifts = [
			reviewShift({
				id: "1",
				employee_id: "a",
				employee_name: "Ava",
				starts_at: new Date("2024-03-18T09:00:00Z"),
				ends_at: new Date("2024-03-18T17:00:00Z"),
			}),
		]

		expect(hoursForShifts(shifts, { "1": 2 })).toEqual({
			regularHours: 6,
			otHours: 2,
		})
	})
})
