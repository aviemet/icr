import { describe, expect, it } from "vitest"

import { categorySlug, isSystemCategorySlug } from "@/lib/categories"

describe("categorySlug", () => {
	it("returns slug for Contact::Email Work", () => {
		expect(categorySlug("Contact::Email", "Work")).toBe("contact-email-work")
	})

	it("returns slug for Calendar::Event Shift", () => {
		expect(categorySlug("Calendar::Event", "Shift")).toBe("calendar-event-shift")
	})

	it("returns slug for Calendar::Event Day Program", () => {
		expect(categorySlug("Calendar::Event", "Day Program")).toBe("calendar-event-day-program")
	})
})

describe("isSystemCategorySlug", () => {
	it("returns true for valid slug in type", () => {
		expect(isSystemCategorySlug("Calendar::Event", "calendar-event-shift")).toBe(true)
		expect(isSystemCategorySlug("Calendar::Event", "calendar-event-day-program")).toBe(true)
	})

	it("returns false for invalid slug", () => {
		expect(isSystemCategorySlug("Calendar::Event", "invalid-slug")).toBe(false)
	})

	it("returns false for slug from different type", () => {
		expect(isSystemCategorySlug("Calendar::Event", "contact-email-work")).toBe(false)
	})
})
