import { MantineProvider, Tabs as MantineTabs } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RecordShowShell } from "@/features/RecordShow"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	Head: ({ children }: { children?: React.ReactNode }) => <>{ children }</>,
	router: {
		get: vi.fn(),
		visit: vi.fn(),
		reload: vi.fn(),
	},
}))

vi.mock("@/components", async () => {
	const actual = await vi.importActual<typeof import("@/components")>("@/components")
	const Tabs = Object.assign(
		({ children, defaultValue, className }: {
			children?: React.ReactNode
			defaultValue?: string
			className?: string
			urlControlled?: boolean
		}) => (
			<MantineTabs defaultValue={ defaultValue } className={ className } keepMounted={ false }>
				{ children }
			</MantineTabs>
		),
		{
			List: MantineTabs.List,
			Tab: MantineTabs.Tab,
			Panel: MantineTabs.Panel,
			Link: () => null,
		},
	)

	return {
		...actual,
		Page: ({ children }: { children?: React.ReactNode }) => <div data-testid="page">{ children }</div>,
		Tabs,
	}
})

describe("RecordShowShell", () => {
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

	it("renders identity chrome with tablist and active panel content", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<RecordShowShell
					title="Maria Santos"
					breadcrumbs={ [{ title: "Clients", href: "/clients" }] }
					avatar={ <span data-testid="record-avatar">MS</span> }
					badge={ <span data-testid="record-badge">Active</span> }
					meta={ <span>Client #: C-1042</span> }
					tabs={ [
						{ id: "overview", label: "Overview", panel: <div>Overview board</div> },
						{ id: "profile", label: "Profile", panel: <div>Profile form</div> },
					] }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("Maria Santos")).toBeInTheDocument()
		expect(screen.getByTestId("record-avatar")).toBeInTheDocument()
		expect(screen.getByTestId("record-badge")).toBeInTheDocument()
		expect(screen.getByText("Client #: C-1042")).toBeInTheDocument()
		expect(screen.getByRole("tablist")).toBeInTheDocument()
		expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument()
		expect(screen.getByRole("tab", { name: "Profile" })).toBeInTheDocument()
		expect(screen.getByText("Overview board")).toBeInTheDocument()
	})
})
