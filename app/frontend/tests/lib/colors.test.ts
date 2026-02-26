import { describe, it, expect } from "vitest"

import { calculateContrastingColor, generateRandomColor } from "@/lib/colors"

const mockTheme = {
	black: "#000000",
	white: "#FFFFFF",
	colors: {
		blue: ["#fff", "#e7f5ff", "#d0ebff", "#a5d8ff", "#74c0fc", "#4dabf7", "#339af0", "#228be6", "#1c7ed6", "#1971c2"],
	},
	primaryShade: { light: 6, dark: 7 },
}

describe("calculateContrastingColor", () => {
	it("returns white for black", () => {
		expect(calculateContrastingColor("black", mockTheme as never, "light")).toBe("#FFFFFF")
	})

	it("returns black for white", () => {
		expect(calculateContrastingColor("white", mockTheme as never, "light")).toBe("#000000")
	})

	it("returns black for undefined color", () => {
		expect(calculateContrastingColor(undefined as never, mockTheme as never, "light")).toBe("#000000")
	})

	it("returns a string in rgb format for generated color", () => {
		const color = generateRandomColor()
		expect(color).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
	})
})

describe("generateRandomColor", () => {
	it("returns rgb string with three components", () => {
		const color = generateRandomColor()
		const match = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/)
		expect(match).not.toBeNull()
		const [, r, g, b] = match!
		expect(Number(r)).toBeGreaterThanOrEqual(0)
		expect(Number(r)).toBeLessThanOrEqual(255)
		expect(Number(g)).toBeGreaterThanOrEqual(0)
		expect(Number(g)).toBeLessThanOrEqual(255)
		expect(Number(b)).toBeGreaterThanOrEqual(0)
		expect(Number(b)).toBeLessThanOrEqual(255)
	})
})
