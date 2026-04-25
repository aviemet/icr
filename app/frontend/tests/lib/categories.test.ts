import { describe, it, expect } from "vitest"

import { categorySlug, isSystemCategorySlug } from "@/lib/categories"

describe("categorySlug", () => {
	it("returns slug for Contact::Email Work", () => {
		expect(categorySlug("Contact::Email", "Work")).toBe("contact-email-work")
	})

	it("returns slug for Shift Regular", () => {
		expect(categorySlug("Shift", "Regular")).toBe("shift-regular")
	})

	it("returns slug for Calendar::Event Shift", () => {
		expect(categorySlug("Calendar::Event", "Shift")).toBe("calendar-event-shift")
	})
})

describe("isSystemCategorySlug", () => {
	it("returns true for valid slug in type", () => {
		expect(isSystemCategorySlug("Shift", "shift-regular")).toBe(true)
		expect(isSystemCategorySlug("Shift", "shift-on-call")).toBe(true)
	})

	it("returns false for invalid slug", () => {
		expect(isSystemCategorySlug("Shift", "invalid-slug")).toBe(false)
	})

	it("returns false for slug from different type", () => {
		expect(isSystemCategorySlug("Shift", "contact-email-work")).toBe(false)
	})
})
