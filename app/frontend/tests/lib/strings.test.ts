import { describe, it, expect } from "vitest"

import {
	capitalize,
	toCamelCase,
	toKebabCase,
	toSnakeCase,
	initials,
	buildShiftTitle,
	formatEventTitle,
	ensureViewName,
	greeting,
	isNonEmptyString,
	greeting,
} from "@/lib/strings"

describe("capitalize", () => {
	it("capitalizes first letter", () => {
		expect(capitalize("hello")).toBe("Hello")
	})

	it("returns empty string for non-string", () => {
		expect(capitalize(null)).toBe("")
		expect(capitalize(undefined)).toBe("")
	})
})

describe("toCamelCase", () => {
	it("converts kebab-case to camelCase", () => {
		expect(toCamelCase("foo-bar")).toBe("fooBar")
	})

	it("converts snake_case to camelCase", () => {
		expect(toCamelCase("foo_bar")).toBe("fooBar")
	})

	it("handles null and undefined", () => {
		expect(toCamelCase(null)).toBe("")
		expect(toCamelCase(undefined)).toBe("")
	})
})

describe("toKebabCase", () => {
	it("converts to kebab-case", () => {
		expect(toKebabCase("fooBar")).toBe("foo-bar")
	})

	it("handles multiple words", () => {
		expect(toKebabCase("Foo Bar")).toBe("foo-bar")
	})
})

describe("toSnakeCase", () => {
	it("converts to snake_case", () => {
		expect(toSnakeCase("fooBar")).toBe("foo_bar")
	})
})

describe("initials", () => {
	it("returns first character for single word", () => {
		expect(initials("John")).toBe("J")
	})

	it("returns first and last word initials for multiple words", () => {
		expect(initials("John Doe")).toBe("JD")
	})

	it("returns undefined for empty string", () => {
		expect(initials("")).toBeUndefined()
	})

	it("splits on space, hyphen, underscore", () => {
		expect(initials("Mary-Jane Watson")).toBe("MW")
	})
})

describe("buildShiftTitle", () => {
	it("includes time range and name when all provided", () => {
		const start = new Date("2024-01-01T09:00:00")
		const end = new Date("2024-01-01T17:00:00")
		expect(buildShiftTitle({ start, end, name: "Shift" })).toMatch(/9am.*5pm.*Shift/)
	})

	it("includes only start time when no end or name", () => {
		const start = new Date("2024-01-01T09:00:00")
		expect(buildShiftTitle({ start })).toMatch(/9am/)
	})

	it("returns empty string when no start", () => {
		expect(buildShiftTitle({})).toBe("")
	})
})

describe("formatEventTitle", () => {
	it("replaces template variables", () => {
		const start = new Date("2024-01-01T09:00:00")
		const end = new Date("2024-01-01T17:00:00")
		const result = formatEventTitle(
			"{full_name}",
			start,
			end,
			{ full_name: "Jane Doe" }
		)
		expect(result).toBe("Jane Doe")
	})

	it("replaces date format placeholders", () => {
		const start = new Date("2024-01-15T09:00:00")
		const end = new Date("2024-01-15T17:00:00")
		const result = formatEventTitle(
			"{start:YYYY-MM-DD}",
			start,
			end,
			{ full_name: "X" }
		)
		expect(result).toBe("2024-01-15")
	})

	it("throws when variable is undefined", () => {
		const start = new Date()
		const end = new Date()
		expect(() =>
			formatEventTitle("{full_name}", start, end, { full_name: undefined })
		).toThrow("Missing required variable")
	})
})

describe("ensureViewName", () => {
	it("returns name when valid view", () => {
		expect(ensureViewName("month")).toBe("month")
		expect(ensureViewName("week")).toBe("week")
	})

	it("returns default month when invalid or null", () => {
		expect(ensureViewName("invalid")).toBe("month")
		expect(ensureViewName(null)).toBe("month")
		expect(ensureViewName(undefined)).toBe("month")
	})
})

describe("greeting", () => {
	it("returns one of the greeting strings", () => {
		const result = greeting()
		expect(["Good morning", "Good afternoon", "Good evening"]).toContain(result)
	})
})

describe("isNonEmptyString", () => {
	it("returns true for non-empty string", () => {
		expect(isNonEmptyString("x")).toBe(true)
	})

	it("returns false for empty string", () => {
		expect(isNonEmptyString("")).toBe(false)
	})

	it("returns false for non-string", () => {
		expect(isNonEmptyString(null)).toBe(false)
		expect(isNonEmptyString(123)).toBe(false)
	})
})
