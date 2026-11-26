import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { HouseholdOverview } from "@/domains/Households/Overview"
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
	router: {
		visit: vi.fn(),
	},
}))

function buildHousehold(overrides: Partial<Schema.HouseholdsShow> = {}): Schema.HouseholdsShow {
	return {
		id: "hh-1",
		slug: "santos-home",
		name: "Santos Home",
		clients: [],
		current_memberships: [],
		past_memberships: [],
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
		...overrides,
	}
}

describe("HouseholdOverview", () => {
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

	it("links members and the schedule action", () => {
		render(
			<MantineProvider theme={ theme }>
				<HouseholdOverview
					household={ buildHousehold({
						current_memberships: [
							{
								id: "m-1",
								household_id: "hh-1",
								client_id: "c-1",
								starts_at: new Date("2024-01-01"),
								created_at: new Date("2024-01-01"),
								updated_at: new Date("2024-01-01"),
								client: {
									id: "c-1",
									slug: "maria-santos",
									full_name: "Maria Santos",
									name: "Maria Santos",
									first_name: "Maria",
									last_name: "Santos",
									person_id: "p-1",
									person: { id: "p-1", name: "Maria Santos" } as Schema.PeoplePersisted,
									color_mappings: {},
									created_at: new Date("2024-01-01"),
									updated_at: new Date("2024-01-01"),
								},
							},
						],
					}) }
				/>
			</MantineProvider>,
		)

		expect(screen.getByRole("link", { name: "Maria Santos" })).toHaveAttribute("href", "/clients/maria-santos")
		expect(screen.getByRole("link", { name: /views.households.show.overview.schedule/ })).toHaveAttribute(
			"href",
			"/households/santos-home/schedule",
		)
	})
})
