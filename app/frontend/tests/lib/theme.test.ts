import { describe, expect, it } from "vitest"

import { cssVariablesResolver, theme } from "@/lib/theme"

describe("cssVariablesResolver", () => {
	it("sets standard text to black in light mode and white in dark mode", () => {
		const resolved = cssVariablesResolver(theme)

		expect(resolved.light["--mantine-color-text"]).toBe("var(--mantine-color-black)")
		expect(resolved.dark["--mantine-color-text"]).toBe("var(--mantine-color-white)")
	})

	it("lightens dimmed text in dark mode", () => {
		const resolved = cssVariablesResolver(theme)

		expect(resolved.dark["--mantine-color-dimmed"]).toBe("var(--mantine-color-dark-1)")
	})
})
