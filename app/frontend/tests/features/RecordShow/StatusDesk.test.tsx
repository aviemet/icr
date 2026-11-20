import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { pageChrome } from "@/components/PageChrome"
import { StatusDesk } from "@/features/RecordShow/StatusDesk"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	Head: ({ children }: { children?: React.ReactNode }) => <>{ children }</>,
}))

vi.mock("@/components", async () => {
	const actual = await vi.importActual<typeof import("@/components")>("@/components")
	return {
		...actual,
		Page: ({ children }: { children?: React.ReactNode }) => <div data-testid="page">{ children }</div>,
		Section: ({ children }: { children?: React.ReactNode }) => <div>{ children }</div>,
	}
})

const options = [
	{ value: "promote", label: "Offer or Apply Position Change" },
	{ value: "process_termination", label: "Process Termination" },
]

describe("StatusDesk", () => {
	beforeEach(() => {
		cleanup()
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: () => ({
				matches: false,
				media: "",
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}),
		})
	})

	it("hides the form until an action is selected", () => {
		const { rerender } = render(
			<MantineProvider theme={ theme }>
				<StatusDesk
					title="Status"
					breadcrumbs={ [] }
					heading="Change status"
					statusLabel="Employed"
					transitionLabel="Action"
					placeholder="Select an action"
					options={ options }
					value=""
					onChange={ vi.fn() }
				>
					<div>Position change form</div>
				</StatusDesk>
			</MantineProvider>,
		)

		expect(screen.queryByText("Position change form")).not.toBeInTheDocument()
		expect(screen.getByPlaceholderText("Select an action")).toBeInTheDocument()
		expect(document.querySelector(`.${pageChrome.panelSurface}`)).toBeTruthy()
		expect(document.querySelector(`.${pageChrome.pageShell}`)).toBeTruthy()

		rerender(
			<MantineProvider theme={ theme }>
				<StatusDesk
					title="Status"
					breadcrumbs={ [] }
					heading="Change status"
					statusLabel="Employed"
					transitionLabel="Action"
					placeholder="Select an action"
					options={ options }
					value="promote"
					onChange={ vi.fn() }
				>
					<div>Position change form</div>
				</StatusDesk>
			</MantineProvider>,
		)

		expect(screen.getByText("Position change form")).toBeInTheDocument()
	})
})
