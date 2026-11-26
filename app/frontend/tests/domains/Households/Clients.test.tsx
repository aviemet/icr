import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { HouseholdClients } from "@/domains/Households/Clients"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

vi.mock("@inertiajs/react", () => ({
	Link: ({ children, href, ...props }: { children?: React.ReactNode, href: string }) => (
		<a href={ href } { ...props }>{ children }</a>
	),
	Form: ({ children }: { children?: React.ReactNode }) => <form>{ children }</form>,
	useFormContext: () => null,
	router: {
		visit: vi.fn(),
		reload: vi.fn(),
		put: vi.fn(),
	},
}))

vi.mock("@/lib/hooks", async (importOriginal) => ({
	...await importOriginal<typeof import("@/lib/hooks")>(),
	useRecordCanUpdate: () => true,
}))

function buildClient(id: string, name: string): Schema.ClientsPersisted {
	return {
		id,
		slug: name.toLowerCase().replace(" ", "-"),
		full_name: name,
		name,
		first_name: name.split(" ")[0] ?? name,
		last_name: name.split(" ")[1] ?? name,
		person_id: `person-${id}`,
		person: { id: `person-${id}`, name } as Schema.PeoplePersisted,
		color_mappings: {},
		created_at: new Date("2024-01-01"),
		updated_at: new Date("2024-01-01"),
	}
}

function buildHousehold(): Schema.HouseholdsShow {
	return {
		id: "hh-1",
		slug: "santos-home",
		name: "Santos Home",
		clients: [buildClient("c-1", "Maria Santos")],
		current_memberships: [
			{
				id: "m-1",
				household_id: "hh-1",
				client_id: "c-1",
				starts_at: new Date("2024-01-01"),
				created_at: new Date("2024-01-01"),
				updated_at: new Date("2024-01-01"),
				client: buildClient("c-1", "Maria Santos"),
			},
		],
		past_memberships: [
			{
				id: "m-2",
				household_id: "hh-1",
				client_id: "c-2",
				starts_at: new Date("2023-01-01"),
				ends_at: new Date("2023-12-01"),
				created_at: new Date("2023-01-01"),
				updated_at: new Date("2023-12-01"),
				client: buildClient("c-2", "Former Member"),
			},
		],
		contact: {
			id: "contact-1",
			contactable_id: "hh-1",
			contactable_type: "Household",
			addresses: [],
			emails: [],
			phones: [],
			created_at: new Date("2024-01-01"),
			updated_at: new Date("2024-01-01"),
		},
		created_at: new Date("2024-01-01"),
		updated_at: new Date("2024-01-01"),
	}
}

describe("HouseholdClients", () => {
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

	it("links current and former members", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<HouseholdClients household={ buildHousehold() } availableClients={ [] } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByRole("link", { name: "Maria Santos" })).toHaveAttribute("href", "/clients/maria-santos")
		expect(screen.getByRole("link", { name: "Former Member" })).toHaveAttribute("href", "/clients/former-member")
	})

	it("swaps schedule for edit and delete when Manage is clicked", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<HouseholdClients household={ buildHousehold() } availableClients={ [] } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByRole("link", { name: "Schedule" })).toHaveAttribute(
			"href",
			"/clients/maria-santos/schedule",
		)
		expect(screen.queryByRole("button", { name: "Edit Maria Santos" })).not.toBeInTheDocument()
		expect(screen.queryByRole("button", { name: "Delete Maria Santos" })).not.toBeInTheDocument()

		fireEvent.click(screen.getByRole("button", { name: "views.households.show.clients.manage" }))

		expect(screen.queryByRole("link", { name: "Schedule" })).not.toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Edit Maria Santos" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Delete Maria Santos" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "views.households.show.clients.done" })).toBeInTheDocument()
	})
})
