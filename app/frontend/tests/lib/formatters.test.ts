import { describe, it, expect } from "vitest"

import { currency, datetime } from "@/lib/formatters"

describe("currency", () => {
	it("formats number as USD by default", () => {
		expect(currency(1234.56)).toBe("$1,234.56")
	})

	it("accepts currency code", () => {
		expect(currency(100, "EUR")).toMatch(/\d+[,.]?\d*\s*€|€\s*\d+[,.]?\d*/)
	})
})

describe("datetime", () => {
	const jan1 = new Date("2024-01-15T14:30:00")

	it("dateShort formats as M/DD/YY", () => {
		expect(datetime.dateShort(jan1)).toBe("1/15/24")
	})

	it("dateEnglish formats as MM/DD/YYYY", () => {
		expect(datetime.dateEnglish(jan1)).toBe("01/15/2024")
	})

	it("dateUrl formats as YYYY-MM-DD", () => {
		expect(datetime.dateUrl(jan1)).toBe("2024-01-15")
	})

	it("accepts string date", () => {
		expect(datetime.dateUrl("2024-01-15")).toBe("2024-01-15")
	})

	it("timeLong formats with minutes and AM/PM", () => {
		expect(datetime.timeLong(jan1)).toBe("02:30 PM")
	})

	it.skip("fromNow returns a string (requires dayjs relativeTime plugin)", () => {
		const past = new Date(Date.now() - 60000)
		expect(typeof datetime.fromNow(past)).toBe("string")
	})
})
