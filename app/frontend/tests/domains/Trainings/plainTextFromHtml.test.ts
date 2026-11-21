import { describe, expect, it } from "vitest"

import { plainTextFromHtml } from "@/domains/Trainings/plainTextFromHtml"

describe("plainTextFromHtml", () => {
	it("strips tags and entities for table display", () => {
		expect(plainTextFromHtml("<p>Hello&nbsp;<strong>world</strong></p>")).toBe("Hello world")
	})

	it("treats empty rich text as blank", () => {
		expect(plainTextFromHtml("<p></p>")).toBe("")
		expect(plainTextFromHtml(null)).toBe("")
	})
})
