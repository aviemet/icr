import { describe, expect, it } from "vitest"

import {
	applyIhssToggleToShifts,
	mergeShiftOtHours,
} from "@/domains/TimeSheets/ihssToggle"

describe("ihssToggle helpers", () => {
	it("updates only the occurrence row matching delta.id", () => {
		const shifts = [
			{ id: "a:2024-03-11T16:00:00.000Z", ihss: false },
			{ id: "a:2024-03-12T16:00:00.000Z", ihss: false },
		] as Schema.ShiftsReview[]

		const next = applyIhssToggleToShifts(shifts, {
			id: "a:2024-03-11T16:00:00.000Z",
			ihss: true,
			shift_ot_hours: {},
		})

		expect(next[0].ihss).toBe(true)
		expect(next[1].ihss).toBe(false)
		expect(next[1]).toBe(shifts[1])
	})

	it("merges shift OT hours by occurrence id", () => {
		expect(mergeShiftOtHours(
			{ "a:1": 1, "a:2": 2 },
			{ "a:1": 3 },
		)).toEqual({ "a:1": 3, "a:2": 2 })
	})
})
