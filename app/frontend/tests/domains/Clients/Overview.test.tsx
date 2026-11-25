import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ClientOverview } from "@/domains/Clients/Overview"
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
		delete: vi.fn(),
	},
}))

vi.mock("@/lib/hooks", async (importOriginal) => ({
	...await importOriginal<typeof import("@/lib/hooks")>(),
	useRecordCanUpdate: () => true,
}))

function buildClient(overrides: Partial<Schema.ClientsShow> = {}): Schema.ClientsShow {
	return {
		id: "client-1",
		slug: "maria-santos",
		name: "Maria Santos",
		full_name: "Maria Santos",
		first_name: "Maria",
		last_name: "Santos",
		person_id: "person-1",
		person: { id: "person-1", name: "Maria Santos" } as Schema.PeopleShow,
		active_allergies_count: 2,
		active_prescriptions_count: 1,
		incident_reports_count: 0,
		emergency_contacts_count: 1,
		uci_number: "UCI-9",
		referral_label: "North",
		regional_center_id: "rc-1",
		referred_by_other: undefined,
		ihss_authorized_hours: 40,
		ihss_share_of_cost: 0,
		current_manager: {
			id: "mgr-1",
			slug: "lead-mgr",
			name: "Lead Manager",
			person: { id: "p-mgr", name: "Lead Manager" },
		} as Schema.EmployeesPersisted,
		current_attendants: [
			{
				id: "att-1",
				slug: "aide-one",
				name: "Aide One",
				person: { id: "p-att", name: "Aide One" },
			} as Schema.EmployeesPersisted,
		],
		household: { id: "hh-1", slug: "santos-home", name: "Santos Home" } as Schema.HouseholdsPersisted,
		allergies: [],
		clients_attendants: [],
		clients_managers: [],
		clients_trainings: [],
		color_mappings: {},
		compliance_form_submissions: [],
		created_at: new Date("2024-01-01"),
		diagnoses: [],
		doctors: [],
		doctors_clients: [],
		documents: [],
		enrollments: [],
		hospital_visits: [],
		images: [],
		incident_reports: [],
		life_detail: {} as Schema.ClientLifeDetailsPersisted,
		links: [],
		prescriptions: [],
		support_contacts: [],
		updated_at: new Date("2024-01-01"),
		...overrides,
	}
}

describe("ClientOverview", () => {
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

	it("renders metric tiles, care team, and built-in quick links", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientOverview client={ buildClient() } />
			</MantineProvider>,
		)

		expect(screen.getByText("views.clients.show.overview.funding")).toBeInTheDocument()
		expect(screen.getByText("UCI-9")).toBeInTheDocument()
		expect(screen.getByText("Lead Manager")).toBeInTheDocument()
		expect(screen.getByText("Aide One")).toBeInTheDocument()
		expect(screen.getByText("views.clients.show.overview.household")).toBeInTheDocument()
		expect(screen.getByText("Santos Home")).toBeInTheDocument()
		expect(screen.getByText("views.clients.show.overview.face_sheet")).toBeInTheDocument()
		expect(screen.getByText("views.clients.show.overview.schedule")).toBeInTheDocument()
		expect(screen.queryByText("views.clients.show.tabs.profile")).not.toBeInTheDocument()
		expect(screen.queryByText("views.clients.show.tabs.medical")).not.toBeInTheDocument()
		expect(screen.getByText("views.clients.show.overview.custom_links")).toBeInTheDocument()
		expect(screen.getByText("views.clients.show.overview.add_link")).toBeInTheDocument()
	})

	it("hides edit actions until modify mode is enabled", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<ClientOverview
						client={ buildClient({
							links: [
								{
									id: "link-1",
									client_id: "client-1",
									title: "Care Portal",
									url: "https://example.com/care",
									created_at: new Date("2024-01-01"),
									updated_at: new Date("2024-01-01"),
								},
							],
						}) }
					/>
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Care Portal")).toBeInTheDocument()
		expect(screen.getByText("https://example.com/care")).toBeInTheDocument()
		expect(screen.queryByText("views.clients.show.overview.edit_link")).not.toBeInTheDocument()

		fireEvent.click(screen.getByRole("button", { name: "views.clients.show.overview.modify_links" }))
		expect(screen.getByText("views.clients.show.overview.edit_link")).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "views.clients.show.overview.done_links" })).toBeInTheDocument()
	})


	it("hides household when the client has none", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientOverview
					client={ buildClient({
						household: null as unknown as Schema.HouseholdsPersisted,
					}) }
				/>
			</MantineProvider>,
		)

		expect(screen.queryByText("views.clients.show.overview.household")).not.toBeInTheDocument()
	})

	it("shows a last-day badge for pending-termination care team members", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientOverview
					client={ buildClient({
						current_attendants: [
							{
								id: "att-1",
								slug: "aide-one",
								name: "Aide One",
								status: "employed",
								inactive_at: new Date("2027-05-01T23:59:59Z"),
								person: { id: "p-att", name: "Aide One" },
							} as Schema.EmployeesPersisted,
						],
					}) }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText(/Last day/)).toBeInTheDocument()
	})

	it("shows open shifts when the viewer can see them", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientOverview
					client={ buildClient({ active_allergies_count: 0 }) }
					canViewOpenShifts
					openShiftsCount={ 3 }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("views.clients.show.overview.open_shifts")).toBeInTheDocument()
		expect(screen.getByText("3")).toBeInTheDocument()
	})

	it("hides open shifts when the viewer cannot see them", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientOverview
					client={ buildClient() }
					canViewOpenShifts={ false }
					openShiftsCount={ 2 }
				/>
			</MantineProvider>,
		)

		expect(screen.queryByText("views.clients.show.overview.open_shifts")).not.toBeInTheDocument()
	})
})
