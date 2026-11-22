import { AppShell, MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Sidebar } from "@/layouts/AppLayout/Sidebar"
import { useStore } from "@/lib/store"
import { theme } from "@/lib/theme"

const locationState = vi.hoisted(() => ({
	paths: ["employees", "applicants"],
}))

vi.mock("@inertiajs/react", () => ({
	Link: ({
		href,
		children,
		className,
	}: {
		href: string
		children: React.ReactNode
		className?: string
	}) => (
		<a href={ href } className={ className }>{ children }</a>
	),
}))

vi.mock("@/lib/hooks", () => ({
	usePageProps: () => ({
		auth: { user: { person: { name: "Ada Lovelace" } } },
	}),
	usePermissions: () => ({
		can: () => true,
	}),
	useLocation: () => ({
		paths: locationState.paths,
	}),
}))

vi.mock("@/layouts/AppLayout/Sidebar/UserMenu", () => ({
	UserMenu: () => <div>User Menu</div>,
}))

vi.mock("@/layouts/AppLayout/ToggleSidebarButton", () => ({
	ToggleSidebarButton: () => <button type="button">Toggle</button>,
}))

function renderSidebar(paths: string[]) {
	locationState.paths = paths
	useStore.setState({ sidebarOpen: true, collapsedMenus: {} })

	return render(
		<MantineProvider theme={ theme } defaultColorScheme="light">
			<AppShell navbar={ { width: 210, breakpoint: "sm" } }>
				<Sidebar />
			</AppShell>
		</MantineProvider>,
	)
}

function navRow(name: string) {
	const link = screen.getByRole("link", { name })
	const row = link.closest(".nav-link")
	expect(row).not.toBeNull()
	return row as HTMLElement
}

describe("Sidebar active nav", () => {
	beforeEach(() => {
		cleanup()
		localStorage.clear()
		useStore.setState({ sidebarOpen: true, collapsedMenus: {} })
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

	it("highlights only Applicants on the applicants page", () => {
		renderSidebar(["employees", "applicants"])

		expect(navRow("Applicants")).toHaveClass("active")
		expect(navRow("Employees")).not.toHaveClass("active")
	})

	it("highlights Employees on the employees index", () => {
		renderSidebar(["employees"])

		expect(navRow("Employees")).toHaveClass("active")
		expect(navRow("Applicants")).not.toHaveClass("active")
	})

	it("highlights only Households on the households page", () => {
		renderSidebar(["households"])

		expect(navRow("Households")).toHaveClass("active")
		expect(navRow("Clients")).not.toHaveClass("active")
	})
})
