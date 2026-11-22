import { describe, expect, it } from "vitest"

import {
	fontFamilyForPreferences,
	themeFontOverridesForPreferences,
} from "@/layouts/Providers/fontFamilyForPreferences"

describe("fontFamilyForPreferences", () => {
	it("returns OpenDyslexic when dyslexia font is enabled", () => {
		expect(fontFamilyForPreferences(true)).toBe("OpenDyslexic, sans-serif")
	})

	it("returns undefined when dyslexia font is disabled", () => {
		expect(fontFamilyForPreferences(false)).toBeUndefined()
	})
})

describe("themeFontOverridesForPreferences", () => {
	it("sets body and headings font when dyslexia font is enabled", () => {
		expect(themeFontOverridesForPreferences(true)).toEqual({
			fontFamily: "OpenDyslexic, sans-serif",
			headings: { fontFamily: "OpenDyslexic, sans-serif" },
		})
	})

	it("returns no overrides when dyslexia font is disabled", () => {
		expect(themeFontOverridesForPreferences(false)).toEqual({})
	})
})
