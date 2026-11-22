import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import * as sectionClasses from "@/components/Section/Section.css"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { theme } from "@/lib/theme"

describe("SettingsPageHeader", () => {
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

	it("renders quiet panel chrome with title and description", () => {
		render(
			<MantineProvider theme={ theme }>
				<SettingsPageHeader
					title="Company Details"
					description="Company name, addresses, and phone numbers."
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("Company Details")).toBeInTheDocument()
		expect(screen.getByText("Company name, addresses, and phone numbers.")).toBeInTheDocument()

		const panel = screen.getByText("Company Details").closest("section")
		expect(panel?.className).toContain(sectionClasses.panel)
		expect(panel?.className).not.toContain(sectionClasses.accent)
	})

	it("renders actions on the right of the title panel", () => {
		render(
			<MantineProvider theme={ theme }>
				<SettingsPageHeader
					title="General"
					description="Locale defaults."
					actions={ <button type="button">Update settings</button> }
				/>
			</MantineProvider>,
		)

		expect(screen.getByRole("button", { name: "Update settings" })).toBeInTheDocument()
	})
})
