import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { Section } from "@/components/Section"
import { theme } from "@/lib/theme"

describe("Section", () => {
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

	it("renders its children", () => {
		render(
			<MantineProvider theme={ theme }>
				<Section variant="panel">
					Panel body
				</Section>
			</MantineProvider>,
		)

		expect(screen.getByText("Panel body")).toBeInTheDocument()
	})

	it("sets the accent color variable", () => {
		render(
			<MantineProvider theme={ theme }>
				<Section variant="panel" accent="yellow" data-testid="panel">
					Panel body
				</Section>
			</MantineProvider>,
		)

		const panel = screen.getByTestId("panel")
		expect(panel.style.getPropertyValue("--section-accent")).toBeTruthy()
	})
})
