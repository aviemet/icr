import { describe, it, expect } from "vitest"

import { invariant } from "@/lib/invariant"

describe("invariant", () => {
	it("does not throw when condition is true", () => {
		expect(() => invariant(true, "msg")).not.toThrow()
	})

	it("throws Error with message when condition is false", () => {
		expect(() => invariant(false, "must be true")).toThrow("must be true")
		expect(() => invariant(false, "must be true")).toThrow(Error)
	})
})
