import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { Label } from "@/components/Inputs/Label"
import * as labelClasses from "@/components/Inputs/Label.css"
import { theme } from "@/lib/theme"

describe("Label", () => {
	beforeEach(() => {
		cleanup()
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: () => ({
				matches: false,
				media: "",
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}),
		})
	})

	it("shows a required mark when required", () => {
		const { container } = render(
			<MantineProvider theme={ theme }>
				<Label required htmlFor="rate">Rate</Label>
			</MantineProvider>,
		)

		expect(screen.getByText("Rate")).toBeInTheDocument()
		expect(container.querySelector(`.${labelClasses.requiredMark}`)?.textContent).toBe("*")
	})

	it("keeps optional labels without a required mark", () => {
		const { container } = render(
			<MantineProvider theme={ theme }>
				<Label htmlFor="notes">Notes</Label>
			</MantineProvider>,
		)

		expect(screen.getByText("Notes")).toBeInTheDocument()
		expect(container.querySelector(`.${labelClasses.requiredMark}`)).toBeNull()
	})

	it("places hint text beside the primary label", () => {
		const { container } = render(
			<MantineProvider theme={ theme }>
				<Label required htmlFor="rate" hint="Current $34.90 (hourly)">Rate</Label>
			</MantineProvider>,
		)

		const label = container.querySelector("label")
		expect(label?.className).toContain(labelClasses.withHint)
		expect(screen.getByText("Current $34.90 (hourly)")).toBeInTheDocument()
		expect(container.querySelector(`.${labelClasses.requiredMark}`)?.textContent).toBe("*")
	})
})
