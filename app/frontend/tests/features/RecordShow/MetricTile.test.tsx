import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import * as sectionClasses from "@/components/Section/Section.css"
import { MetricTile } from "@/features/RecordShow"
import { theme } from "@/lib/theme"

describe("MetricTile", () => {
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

	it("renders title icon on a quiet panel", () => {
		render(
			<MantineProvider theme={ theme }>
				<MetricTile title="Funding" icon={ <span data-testid="tile-icon">$</span> }>
					UCI 123
				</MetricTile>
			</MantineProvider>,
		)

		expect(screen.getByText("Funding")).toBeInTheDocument()
		expect(screen.getByTestId("tile-icon")).toBeInTheDocument()
		expect(screen.getByText("UCI 123")).toBeInTheDocument()

		const panel = screen.getByText("Funding").closest("section")
		expect(panel?.className).toContain(sectionClasses.panel)
		expect(panel?.className).not.toContain(sectionClasses.accent)
	})

	it("maps alert tone to yellow accent", () => {
		render(
			<MantineProvider theme={ theme }>
				<MetricTile title="Alerts" tone="alert">
					2 allergies
				</MetricTile>
			</MantineProvider>,
		)

		const panel = screen.getByText("Alerts").closest("section") as HTMLElement
		expect(panel.style.getPropertyValue("--section-accent")).toBeTruthy()
		expect(panel.className).toContain(sectionClasses.accent)
	})
})
