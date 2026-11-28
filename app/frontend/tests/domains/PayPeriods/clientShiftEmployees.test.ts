import { describe, expect, it } from "vitest"

import {
	defaultEmployeeId,
	employeeOptionsFromEmployees,
	hoursForShifts,
	resolveSelectedEmployeeId,
	shiftsForEmployee,
} from "@/domains/PayPeriods/clientShiftEmployees"

function reviewShift(
	overrides: Partial<Schema.ShiftsReview> & Pick<Schema.ShiftsReview, "id" | "employee_id" | "employee_name">,
): Schema.ShiftsReview {
	return {
		calendar_event_id: "event-1",
		client_name: "Client",
		client_slug: "client",
		created_at: new Date("2024-03-18T09:00:00Z"),
		ends_at: new Date("2024-03-18T17:00:00Z"),
		ihss: false,
		is_recurring: false,
		service_type: {
			id: "st-1",
			active: true,
			allows_multi_client: false,
			assignable: true,
			billable: true,
			color: "#15803D",
			name: "Direct",
			payable: true,
			position: 0,
			requires_notes: false,
			slug: "direct",
			system: false,
			tracks_mileage: false,
		},
		service_type_id: "st-1",
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

describe("resolveSelectedEmployeeId", () => {
	it("keeps the current employee after their shifts are fully reviewed", () => {
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

		expect(resolveSelectedEmployeeId("a", shifts, options)).toBe("a")
		expect(resolveSelectedEmployeeId(null, shifts, options)).toBe("b")
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
			doubleTimeHours: 0,
			ihssHours: 0,
		})
	})

	it("sums IHSS hours from shifts marked IHSS", () => {
		const shifts = [
			reviewShift({
				id: "1",
				employee_id: "a",
				employee_name: "Ava",
				ihss: true,
				starts_at: new Date("2024-03-18T09:00:00Z"),
				ends_at: new Date("2024-03-18T15:00:00Z"),
			}),
			reviewShift({
				id: "2",
				employee_id: "a",
				employee_name: "Ava",
				ihss: false,
				starts_at: new Date("2024-03-19T09:00:00Z"),
				ends_at: new Date("2024-03-19T17:00:00Z"),
			}),
		]

		expect(hoursForShifts(shifts, {})).toEqual({
			regularHours: 14,
			otHours: 0,
			doubleTimeHours: 0,
			ihssHours: 6,
		})
	})
})
