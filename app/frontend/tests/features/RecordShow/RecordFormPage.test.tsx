import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { pageChrome } from "@/components/PageChrome"
import { FormBand, RecordFormPage } from "@/features/RecordShow"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	Head: ({ children }: { children?: React.ReactNode }) => <>{ children }</>,
}))

vi.mock("@/components", async () => {
	const actual = await vi.importActual<typeof import("@/components")>("@/components")
	return {
		...actual,
		Page: ({ children }: { children?: React.ReactNode }) => <div data-testid="page">{ children }</div>,
	}
})

describe("RecordFormPage", () => {
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

	it("renders a panel header and panel form bands", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<RecordFormPage
					title="New Client"
					description="Add demographics, funding, and communication preferences."
				>
					<FormBand title="Demographics" description="Legal name and client number.">
						<div>Form body</div>
					</FormBand>
				</RecordFormPage>
			</MantineProvider>,
		)

		expect(screen.getByText("New Client")).toBeInTheDocument()
		expect(screen.getByText("Add demographics, funding, and communication preferences.")).toBeInTheDocument()
		expect(screen.getByText("Demographics")).toBeInTheDocument()
		expect(screen.getByText("Form body")).toBeInTheDocument()

		const header = screen.getByText("New Client").closest("header")
		expect(header?.className).toContain(pageChrome.panelSurface)

		const band = screen.getByText("Demographics").closest("section")
		expect(band?.className).toContain(pageChrome.panelSurface)
	})
})
