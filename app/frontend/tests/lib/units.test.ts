import { describe, it, expect } from "vitest"

import { rem, px } from "@/lib/units"

describe("rem", () => {
	it("converts number (pixels) to rem with scale variable", () => {
		expect(rem(16)).toBe("calc(1rem * var(--mantine-scale))")
		expect(rem(32)).toBe("calc(2rem * var(--mantine-scale))")
		expect(rem(8)).toBe("calc(0.5rem * var(--mantine-scale))")
	})

	it("converts px string to rem", () => {
		expect(rem("16px")).toBe("calc(1rem * var(--mantine-scale))")
	})

	it("passes through values already in rem", () => {
		expect(rem("2rem")).toBe("2rem")
	})
})

describe("px", () => {
	it("converts string to number", () => {
		const result = px("16px")
		expect(typeof result).toBe("number")
		expect(result).toBe(16)
	})
})
