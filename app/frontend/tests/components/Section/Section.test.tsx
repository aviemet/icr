import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { Section } from "@/components/Section"
import * as sectionClasses from "@/components/Section/Section.css"
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

	it("renders panel variant without accent by default", () => {
		render(
			<MantineProvider theme={ theme }>
				<Section variant="panel" data-testid="panel">
					Panel body
				</Section>
			</MantineProvider>,
		)

		const panel = screen.getByTestId("panel")
		expect(panel.className).toContain(sectionClasses.panel)
		expect(panel.className).not.toContain(sectionClasses.accent)
		expect(panel.className).not.toContain(sectionClasses.root)
	})

	it("applies accent stripe when accent is set", () => {
		render(
			<MantineProvider theme={ theme }>
				<Section variant="panel" accent data-testid="panel">
					Panel body
				</Section>
			</MantineProvider>,
		)

		const panel = screen.getByTestId("panel")
		expect(panel.className).toContain(sectionClasses.panel)
		expect(panel.className).toContain(sectionClasses.accent)
		expect(panel.style.getPropertyValue("--section-accent")).toBeTruthy()
	})

	it("keeps plain variant without panel chrome", () => {
		render(
			<MantineProvider theme={ theme }>
				<Section data-testid="plain">
					Plain body
				</Section>
			</MantineProvider>,
		)

		const plain = screen.getByTestId("plain")
		expect(plain.className).toContain(sectionClasses.root)
		expect(plain.className).not.toContain(sectionClasses.panel)
		expect(plain.className).not.toContain(sectionClasses.accent)
	})
})
