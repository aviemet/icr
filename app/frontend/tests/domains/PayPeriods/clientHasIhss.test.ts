import { describe, expect, it } from "vitest"

import { clientHasIhss } from "@/domains/PayPeriods/clientHasIhss"

describe("clientHasIhss", () => {
	it("is true when authorized hours are positive", () => {
		expect(clientHasIhss({ ihss_authorized_hours: 40 })).toBe(true)
		expect(clientHasIhss({ ihss_authorized_hours: "12.5" })).toBe(true)
	})

	it("is false when authorized hours are blank or zero", () => {
		expect(clientHasIhss({ ihss_authorized_hours: 0 })).toBe(false)
		expect(clientHasIhss({ ihss_authorized_hours: "0" })).toBe(false)
		expect(clientHasIhss({ ihss_authorized_hours: null })).toBe(false)
		expect(clientHasIhss({})).toBe(false)
	})
})
