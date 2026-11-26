import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

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

	it("renders the heading and supplied action", () => {
		render(
			<MantineProvider theme={ theme }>
				<SettingsPageHeader
					title="General"
					description="Locale defaults."
					actions={ <button type="button">Update settings</button> }
				/>
			</MantineProvider>,
		)

		expect(screen.getByRole("heading", { name: "General" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Update settings" })).toBeInTheDocument()
	})
})
