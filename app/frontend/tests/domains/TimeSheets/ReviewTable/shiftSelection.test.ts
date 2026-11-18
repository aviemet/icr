import { describe, expect, it } from "vitest"

import {
	nextSelectedShiftIds,
	selectedShiftIdsForToggleAll,
} from "@/domains/TimeSheets/ReviewTable/shiftSelection"

describe("shiftSelection", () => {
	it("adds and removes a shift id", () => {
		expect(nextSelectedShiftIds([], "a", true)).toEqual(["a"])
		expect(nextSelectedShiftIds(["a"], "a", true)).toEqual(["a"])
		expect(nextSelectedShiftIds(["a", "b"], "a", false)).toEqual(["b"])
	})

	it("selects all or clears selection", () => {
		expect(selectedShiftIdsForToggleAll(["a", "b"], true)).toEqual(["a", "b"])
		expect(selectedShiftIdsForToggleAll(["a", "b"], false)).toEqual([])
	})
})
