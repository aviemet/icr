import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { MenuLink } from "@/layouts/AppLayout/Sidebar/MenuLink"
import { useStore } from "@/lib/store"
import {
	COLLAPSED_MENUS_STORAGE_KEY,
} from "@/lib/store/layoutSlice"
import { theme } from "@/lib/theme"

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

function renderMenu(sidebarOpen = true) {
	useStore.setState({
		sidebarOpen,
		collapsedMenus: {},
	})

	return render(
		<MantineProvider theme={ theme } defaultColorScheme="light">
			<ul>
				<MenuLink
					label="Clients"
					href="/clients"
					menuKey="clients"
				>
					<MenuLink label="Households" href="/households" />
				</MenuLink>
			</ul>
		</MantineProvider>,
	)
}

describe("MenuLink", () => {
	beforeEach(() => {
		cleanup()
		localStorage.clear()
		useStore.setState({
			sidebarOpen: true,
			collapsedMenus: {},
		})
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

	it("shows children under the parent when the sidebar is open", () => {
		renderMenu(true)

		expect(screen.getByRole("link", { name: "Clients" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Households" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Collapse Clients" })).toHaveAttribute("aria-expanded", "true")
	})

	it("toggles children with the chevron and persists the preference", async () => {
		const user = userEvent.setup()
		renderMenu(true)

		await user.click(screen.getByRole("button", { name: "Collapse Clients" }))

		expect(screen.queryByRole("link", { name: "Households" })).not.toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Expand Clients" })).toHaveAttribute("aria-expanded", "false")
		expect(localStorage.getItem(COLLAPSED_MENUS_STORAGE_KEY)).toBe(JSON.stringify({ clients: true }))

		await user.click(screen.getByRole("button", { name: "Expand Clients" }))

		expect(screen.getByRole("link", { name: "Households" })).toBeInTheDocument()
		expect(localStorage.getItem(COLLAPSED_MENUS_STORAGE_KEY)).toBe(JSON.stringify({ clients: false }))
	})

	it("keeps the submenu in the DOM for the closed-sidebar flyout even when collapsed", () => {
		useStore.setState({
			sidebarOpen: false,
			collapsedMenus: { clients: true },
		})

		render(
			<MantineProvider theme={ theme } defaultColorScheme="light">
				<ul>
					<MenuLink
						label="Clients"
						href="/clients"
						menuKey="clients"
					>
						<MenuLink label="Households" href="/households" />
					</MenuLink>
				</ul>
			</MantineProvider>,
		)

		expect(screen.getByRole("link", { name: "Households" })).toBeInTheDocument()
		expect(screen.queryByRole("button", { name: /Clients/ })).not.toBeInTheDocument()
	})
})
